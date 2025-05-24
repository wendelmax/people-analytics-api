import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateRecommendationDto } from '@application/graphql/dto/create-recommendation.dto';
import { UpdateRecommendationDto } from '@application/graphql/dto/update-recommendation.dto';
import { Recommendation } from '@application/graphql/types/recommendation.type';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Recommendation[]> {
    const result = await this.prisma.recommendation.findMany({
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((recommendation) => ({
      id: recommendation.id.toString(),
      employeeId: recommendation.employeeId.toString(),
      title: recommendation.title,
      description: recommendation.description,
      type: recommendation.type,
      priority: recommendation.priority,
      status: recommendation.status,
      skillIds: recommendation.skills.map((s) => s.id.toString()),
      createdAt: recommendation.createdAt,
      updatedAt: recommendation.updatedAt,
    }));
  }

  async findById(id: string): Promise<Recommendation> {
    const result = await this.prisma.recommendation.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      type: result.type,
      priority: result.priority,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Recommendation[]> {
    const result = await this.prisma.recommendation.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((recommendation) => ({
      id: recommendation.id.toString(),
      employeeId: recommendation.employeeId.toString(),
      title: recommendation.title,
      description: recommendation.description,
      type: recommendation.type,
      priority: recommendation.priority,
      status: recommendation.status,
      skillIds: recommendation.skills.map((s) => s.id.toString()),
      createdAt: recommendation.createdAt,
      updatedAt: recommendation.updatedAt,
    }));
  }

  async create(data: CreateRecommendationDto): Promise<Recommendation> {
    const result = await this.prisma.recommendation.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      type: result.type,
      priority: result.priority,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateRecommendationDto): Promise<Recommendation> {
    const result = await this.prisma.recommendation.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      type: result.type,
      priority: result.priority,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.recommendation.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
