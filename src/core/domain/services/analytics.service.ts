import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  GoalStatus,
  PerformanceReview,
  RecommendationPriority,
  RecommendationStatus,
  TrainingStatus,
} from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AnalyticsOverview> {
    const now = new Date();

    const [employeeCount, activeGoals, openRecommendations, upcomingTrainings, skillUsage] =
      await Promise.all([
        this.prisma.employee.count(),
        this.prisma.goal.count({
          where: {
            status: {
              notIn: [GoalStatus.COMPLETED, GoalStatus.CANCELLED],
            },
          },
        }),
        this.prisma.recommendation.count({
          where: {
            status: {
              notIn: [RecommendationStatus.COMPLETED, RecommendationStatus.DISMISSED],
            },
          },
        }),
        this.prisma.training.count({
          where: {
            startDate: {
              gte: now,
            },
            status: {
              in: [TrainingStatus.ENROLLED, TrainingStatus.IN_PROGRESS],
            },
          },
        }),
        this.aggregateSkillUsage(),
      ]);

    return {
      employeeCount,
      activeGoals,
      openRecommendations,
      upcomingTrainings,
      topSkills: skillUsage,
    };
  }

  async getEmployeeSnapshot(employeeId: string): Promise<EmployeeAnalyticsSnapshot> {
    await this.ensureEmployeeExists(employeeId);

    const [recentReviews, openGoals, activeTrainings, pendingRecommendations] = await Promise.all([
      this.prisma.performanceReview.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
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
      this.prisma.employeeTraining.findMany({
        where: {
          employeeId,
          status: {
            in: [TrainingStatus.ENROLLED, TrainingStatus.IN_PROGRESS],
          },
        },
        include: {
          training: true,
        },
      }),
      this.prisma.recommendation.findMany({
        where: {
          employeeId,
          status: {
            notIn: [RecommendationStatus.COMPLETED, RecommendationStatus.DISMISSED],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          skills: true,
        },
      }),
    ]);

    return {
      recentReviews: recentReviews.map((review) => this.mapReview(review)),
      openGoals: openGoals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        status: goal.status,
        progress: goal.progress,
        targetDate: goal.targetDate,
      })),
      activeTrainings: activeTrainings.map((link) => ({
        trainingId: link.trainingId,
        trainingName: link.training.name,
        status: link.status,
        startedAt: link.startedAt,
      })),
      pendingRecommendations: pendingRecommendations.map((recommendation) => ({
        id: recommendation.id,
        title: recommendation.title,
        status: recommendation.status,
        priority: recommendation.priority,
        createdAt: recommendation.createdAt,
        skillIds: recommendation.skills.map((skill) => skill.skillId),
      })),
    };
  }

  async getPerformanceTrend(range?: AnalyticsRange): Promise<PerformanceTrendPoint[]> {
    const { start, end } = this.resolveRange(range);

    const reviews = await this.prisma.performanceReview.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        createdAt: true,
        overallRating: true,
      },
    });

    const buckets = new Map<string, { total: number; count: number }>();

    for (const review of reviews) {
      const key = `${review.createdAt.getUTCFullYear()}-${String(review.createdAt.getUTCMonth() + 1).padStart(2, '0')}`;
      const bucket = buckets.get(key) ?? { total: 0, count: 0 };
      if (review.overallRating !== null && review.overallRating !== undefined) {
        bucket.total += review.overallRating;
        bucket.count += 1;
      }
      buckets.set(key, bucket);
    }

    return Array.from(buckets.entries())
      .map(([period, values]) => ({
        period,
        averageRating: values.count > 0 ? values.total / values.count : null,
        reviews: values.count,
      }))
      .sort((a, b) => (a.period < b.period ? -1 : 1));
  }

  private async aggregateSkillUsage(): Promise<SkillUsage[]> {
    const skillCounts = await this.prisma.employeeSkill.groupBy({
      by: ['skillId'],
      _count: {
        skillId: true,
      },
      orderBy: {
        _count: {
          skillId: 'desc',
        },
      },
      take: 5,
    });

    if (skillCounts.length === 0) {
      return [];
    }

    const skillIds = skillCounts.map((item) => item.skillId);
    const skills = await this.prisma.skill.findMany({
      where: { id: { in: skillIds } },
      select: { id: true, name: true },
    });

    const skillMap = new Map(skills.map((skill) => [skill.id, skill.name]));

    return skillCounts.map((item) => ({
      skillId: item.skillId,
      skillName: skillMap.get(item.skillId) ?? 'Unknown',
      employees: item._count.skillId,
    }));
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

  private resolveRange(range?: AnalyticsRange): { start: Date; end: Date } {
    const end = range?.endDate ? new Date(range.endDate) : new Date();
    const start = range?.startDate
      ? new Date(range.startDate)
      : new Date(new Date(end).setUTCMonth(end.getUTCMonth() - 6));

    return { start, end };
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
}

type AnalyticsRange = {
  startDate?: string;
  endDate?: string;
};

type SkillUsage = {
  skillId: string;
  skillName: string;
  employees: number;
};

type ReviewSummary = {
  id: string;
  status: string;
  overallRating?: number;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
};

export type AnalyticsOverview = {
  employeeCount: number;
  activeGoals: number;
  openRecommendations: number;
  upcomingTrainings: number;
  topSkills: SkillUsage[];
};

export type EmployeeAnalyticsSnapshot = {
  recentReviews: ReviewSummary[];
  openGoals: {
    id: string;
    title: string;
    status: GoalStatus;
    progress: number;
    targetDate: Date;
  }[];
  activeTrainings: {
    trainingId: string;
    trainingName: string;
    status: TrainingStatus;
    startedAt: Date;
  }[];
  pendingRecommendations: {
    id: string;
    title: string;
    status: RecommendationStatus;
    priority: RecommendationPriority;
    createdAt: Date;
    skillIds: string[];
  }[];
};

export type PerformanceTrendPoint = {
  period: string;
  averageRating: number | null;
  reviews: number;
};
