import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '@application/api/dto/recommendation.dto';
import {
  Prisma,
  RecommendationPriority,
  RecommendationSource,
  RecommendationStatus,
} from '@prisma/client';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RecommendationModel[]> {
    const recommendations = await this.prisma.recommendation.findMany({
      include: {
        employee: true,
        skills: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return recommendations.map((recommendation) => this.mapToModel(recommendation));
  }

  async findById(id: string): Promise<RecommendationModel> {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!recommendation) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }

    return this.mapToModel(recommendation);
  }

  async findByEmployeeId(employeeId: string): Promise<RecommendationModel[]> {
    const recommendations = await this.prisma.recommendation.findMany({
      where: { employeeId },
      include: {
        employee: true,
        skills: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return recommendations.map((recommendation) => this.mapToModel(recommendation));
  }

  async create(data: CreateRecommendationDto): Promise<RecommendationModel> {
    const recommendation = await this.prisma.recommendation.create({
      data: {
        employeeId: data.employeeId,
        title: data.title,
        description: data.description,
        source: data.source,
        priority: data.priority,
        status: data.status,
        skills: data.skillIds?.length
          ? {
              create: data.skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return this.mapToModel(recommendation);
  }

  async update(id: string, data: UpdateRecommendationDto): Promise<RecommendationModel> {
    await this.ensureExists(id);

    const recommendation = await this.prisma.recommendation.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        source: data.source,
        priority: data.priority,
        status: data.status,
        skills: data.skillIds
          ? {
              deleteMany: {},
              create: data.skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return this.mapToModel(recommendation);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.recommendation.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.recommendation.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
  }

  private mapToModel(recommendation: RecommendationWithRelations): RecommendationModel {
    return {
      id: recommendation.id,
      employeeId: recommendation.employeeId,
      title: recommendation.title,
      description: recommendation.description ?? undefined,
      source: recommendation.source,
      priority: recommendation.priority,
      status: recommendation.status,
      skillIds: recommendation.skills.map((link) => link.skillId),
      createdAt: recommendation.createdAt,
      updatedAt: recommendation.updatedAt,
    };
  }
}

type RecommendationWithRelations = Prisma.RecommendationGetPayload<{
  include: {
    employee: true;
    skills: true;
  };
}>;

export type RecommendationModel = {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  source: RecommendationSource;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  skillIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
