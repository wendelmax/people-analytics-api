import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  EmployeeJourneyStatus,
  GoalPriority,
  GoalStatus,
  RecommendationPriority,
  RecommendationStatus,
  TrainingStatus,
} from '@prisma/client';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeeOverview(employeeId: string): Promise<CareerOverviewModel> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        position: true,
        department: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const [goals, recommendations, trainings, journeys, suggestedPaths] = await Promise.all([
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
        take: 10,
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
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.employeeJourney.findMany({
        where: { employeeId },
        include: {
          department: true,
          position: true,
          touchpoints: {
            orderBy: { occurredAt: 'asc' },
          },
        },
        orderBy: { startDate: 'desc' },
      }),
      this.getSuggestedPaths(employeeId, { includeStages: true }),
    ]);

    return {
      employee: {
        id: employee.id,
        name: employee.name,
        department: employee.department
          ? { id: employee.department.id, name: employee.department.name }
          : undefined,
        position: employee.position
          ? { id: employee.position.id, title: employee.position.title }
          : undefined,
      },
      goals: goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        status: goal.status,
        priority: goal.priority,
        progress: goal.progress,
        targetDate: goal.targetDate,
      })),
      recommendations: recommendations.map((recommendation) => ({
        id: recommendation.id,
        title: recommendation.title,
        priority: recommendation.priority,
        status: recommendation.status,
        createdAt: recommendation.createdAt,
      })),
      trainings: trainings.map((link) => ({
        trainingId: link.trainingId,
        name: link.training.name,
        status: link.status,
        startedAt: link.startedAt,
        plannedEnd: link.training.endDate ?? undefined,
      })),
      journeys: journeys.map((journey) => ({
        id: journey.id,
        type: journey.type,
        status: journey.status,
        startDate: journey.startDate,
        endDate: journey.endDate ?? undefined,
        department: journey.department
          ? { id: journey.department.id, name: journey.department.name }
          : undefined,
        position: journey.position
          ? { id: journey.position.id, title: journey.position.title }
          : undefined,
        touchpoints: journey.touchpoints.map((touchpoint) => ({
          id: touchpoint.id,
          title: touchpoint.title,
          occurredAt: touchpoint.occurredAt,
        })),
      })),
      suggestedPaths,
    };
  }

  async getSuggestedPaths(
    employeeId: string,
    options: { includeStages?: boolean } = {},
  ): Promise<CareerPathSuggestion[]> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        positionId: true,
        departmentId: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const paths = await this.prisma.careerPath.findMany({
      where: {
        OR: [
          {
            positionLinks: {
              some: {
                positionId: employee.positionId,
              },
            },
          },
          {
            stages: {
              some: {
                title: {
                  contains: 'manager',
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
      include: {
        skillLinks: true,
        stages: options.includeStages
          ? {
              orderBy: { order: 'asc' },
            }
          : undefined,
      },
      orderBy: { name: 'asc' },
      take: 10,
    });

    return paths.map((path) => ({
      id: path.id,
      name: path.name,
      description: path.description ?? undefined,
      skillIds: path.skillLinks.map((link) => link.skillId),
      stages: options.includeStages
        ? path.stages.map((stage) => ({
            id: stage.id,
            title: stage.title,
            order: stage.order,
          }))
        : undefined,
    }));
  }
}

export type CareerOverviewModel = {
  employee: {
    id: string;
    name: string;
    department?: {
      id: string;
      name: string;
    };
    position?: {
      id: string;
      title: string;
    };
  };
  goals: {
    id: string;
    title: string;
    status: GoalStatus;
    priority: GoalPriority;
    progress: number;
    targetDate: Date;
  }[];
  recommendations: {
    id: string;
    title: string;
    priority: RecommendationPriority;
    status: RecommendationStatus;
    createdAt: Date;
  }[];
  trainings: {
    trainingId: string;
    name: string;
    status: TrainingStatus;
    startedAt: Date;
    plannedEnd?: Date;
  }[];
  journeys: {
    id: string;
    type: string;
    status: EmployeeJourneyStatus;
    startDate: Date;
    endDate?: Date;
    department?: {
      id: string;
      name: string;
    };
    position?: {
      id: string;
      title: string;
    };
    touchpoints: {
      id: string;
      title: string;
      occurredAt: Date;
    }[];
  }[];
  suggestedPaths: CareerPathSuggestion[];
};

export type CareerPathSuggestion = {
  id: string;
  name: string;
  description?: string;
  skillIds: string[];
  stages?: {
    id: string;
    title: string;
    order: number;
  }[];
};
