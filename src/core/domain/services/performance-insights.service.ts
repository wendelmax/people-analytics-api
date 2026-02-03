import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  GoalStatus,
  PerformanceReview,
  RecommendationPriority,
  RecommendationStatus,
} from '@prisma/client';

@Injectable()
export class PerformanceInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(range?: PerformanceInsightRange): Promise<PerformanceSummary> {
    const { start, end } = this.resolveRange(range);

    const [reviews, openGoals, activeRecommendations] = await Promise.all([
      this.prisma.performanceReview.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.goal.count({
        where: {
          status: {
            notIn: [GoalStatus.COMPLETED, GoalStatus.CANCELLED],
          },
          updatedAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.recommendation.count({
        where: {
          status: {
            notIn: [RecommendationStatus.COMPLETED, RecommendationStatus.DISMISSED],
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    const ratings = await this.prisma.performanceReview.aggregate({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        overallRating: {
          not: null,
        },
      },
      _avg: {
        overallRating: true,
      },
    });

    return {
      periodStart: start,
      periodEnd: end,
      totalReviews: reviews,
      averageRating: ratings._avg.overallRating ?? null,
      activeGoals: openGoals,
      pendingRecommendations: activeRecommendations,
    };
  }

  async getDepartmentInsights(range?: PerformanceInsightRange): Promise<DepartmentInsight[]> {
    const { start, end } = this.resolveRange(range);

    const reviews = await this.prisma.performanceReview.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const grouped = new Map<string, AggregatedValues & { employeeIds: Set<string> }>();

    for (const review of reviews) {
      const department = review.employee.department;
      if (!department) {
        continue;
      }
      const existing = grouped.get(department.id);
      if (!existing) {
        grouped.set(department.id, {
          entityId: department.id,
          entityName: department.name,
          total: 0,
          count: 0,
          employeeIds: new Set([review.employee.id]),
        });
      } else {
        existing.employeeIds.add(review.employee.id);
      }
      const bucket = grouped.get(department.id)!;
      if (review.overallRating !== null && review.overallRating !== undefined) {
        bucket.total += review.overallRating;
        bucket.count += 1;
      }
    }

    return Array.from(grouped.values()).map((bucket) => ({
      departmentId: bucket.entityId,
      departmentName: bucket.entityName,
      averageRating: bucket.count > 0 ? bucket.total / bucket.count : null,
      reviews: bucket.count,
      employeeCount: bucket.employeeIds.size,
    }));
  }

  async getPositionInsights(range?: PerformanceInsightRange): Promise<PositionInsight[]> {
    const { start, end } = this.resolveRange(range);

    const reviews = await this.prisma.performanceReview.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: {
          select: {
            positionId: true,
            position: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const grouped = new Map<string, AggregatedValues>();

    for (const review of reviews) {
      const position = review.employee.position;
      if (!position) {
        continue;
      }
      const bucket = grouped.get(position.id) ?? {
        entityId: position.id,
        entityName: position.title,
        total: 0,
        count: 0,
      };
      if (review.overallRating !== null && review.overallRating !== undefined) {
        bucket.total += review.overallRating;
        bucket.count += 1;
      }
      grouped.set(position.id, bucket);
    }

    return Array.from(grouped.values()).map((bucket) => ({
      positionId: bucket.entityId,
      positionTitle: bucket.entityName,
      averageRating: bucket.count > 0 ? bucket.total / bucket.count : null,
      reviews: bucket.count,
    }));
  }

  async getEmployeeInsight(employeeId: string): Promise<EmployeeInsight> {
    await this.ensureEmployeeExists(employeeId);

    const [recentReviews, activeGoals, pendingRecommendations] = await Promise.all([
      this.prisma.performanceReview.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      this.prisma.goal.findMany({
        where: {
          employeeId,
          status: {
            notIn: [GoalStatus.COMPLETED, GoalStatus.CANCELLED],
          },
        },
        orderBy: { targetDate: 'asc' },
      }),
      this.prisma.recommendation.findMany({
        where: {
          employeeId,
          status: {
            notIn: [RecommendationStatus.COMPLETED, RecommendationStatus.DISMISSED],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

    const averageRating = this.calculateAverageRating(recentReviews);

    return {
      employeeId,
      averageRating,
      recentReviews: recentReviews.map((review) => this.mapReview(review)),
      goals: activeGoals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        status: goal.status,
        targetDate: goal.targetDate,
        progress: goal.progress,
      })),
      recommendations: pendingRecommendations.map((recommendation) => ({
        id: recommendation.id,
        title: recommendation.title,
        status: recommendation.status,
        priority: recommendation.priority,
        createdAt: recommendation.createdAt,
      })),
    };
  }

  private resolveRange(range?: PerformanceInsightRange): { start: Date; end: Date } {
    const end = range?.endDate ? new Date(range.endDate) : new Date();
    const start = range?.startDate
      ? new Date(range.startDate)
      : new Date(new Date(end).setUTCMonth(end.getUTCMonth() - 6));

    return { start, end };
  }

  private calculateAverageRating(reviews: PerformanceReview[]): number | null {
    const ratings = reviews
      .map((review) => review.overallRating)
      .filter((rating): rating is number => rating !== null && rating !== undefined);

    if (ratings.length === 0) {
      return null;
    }

    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return total / ratings.length;
  }

  private async ensureEmployeeExists(employeeId: string): Promise<void> {
    const exists = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
  }

  private mapReview(review: PerformanceReview): ReviewSummary {
    return {
      id: review.id,
      status: review.status,
      overallRating: review.overallRating ?? undefined,
      periodStart: review.periodStart,
      periodEnd: review.periodEnd,
      createdAt: review.createdAt,
    };
  }
}

type PerformanceInsightRange = {
  startDate?: string;
  endDate?: string;
};

type AggregatedValues = {
  entityId: string;
  entityName: string;
  total: number;
  count: number;
};

type ReviewSummary = {
  id: string;
  status: string;
  overallRating?: number;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
};

export type PerformanceSummary = {
  periodStart: Date;
  periodEnd: Date;
  totalReviews: number;
  averageRating: number | null;
  activeGoals: number;
  pendingRecommendations: number;
};

export type DepartmentInsight = {
  departmentId: string;
  departmentName: string;
  averageRating: number | null;
  reviews: number;
  employeeCount: number;
};

export type PositionInsight = {
  positionId: string;
  positionTitle: string;
  averageRating: number | null;
  reviews: number;
};

export type EmployeeInsight = {
  employeeId: string;
  averageRating: number | null;
  recentReviews: ReviewSummary[];
  goals: {
    id: string;
    title: string;
    status: GoalStatus;
    targetDate: Date;
    progress: number;
  }[];
  recommendations: {
    id: string;
    title: string;
    status: RecommendationStatus;
    priority: RecommendationPriority;
    createdAt: Date;
  }[];
};
