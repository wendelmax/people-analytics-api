import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreatePerformanceDto } from '@application/graphql/dto/create-performance.dto';
import { UpdatePerformanceDto } from '@application/graphql/dto/update-performance.dto';
import { Performance } from '@application/graphql/types/performance.type';

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Performance[]> {
    const result = await this.prisma.performance.findMany({
      include: {
        employee: true,
        goals: true,
      },
    });

    return result.map((performance) => ({
      id: performance.id.toString(),
      employeeId: performance.employeeId.toString(),
      date: performance.date,
      rating: performance.rating,
      comments: performance.comments,
      goals: performance.goals.map((g) => g.id.toString()),
      achievements: performance.achievements,
      areasForImprovement: performance.areasForImprovement,
      createdAt: performance.createdAt,
      updatedAt: performance.updatedAt,
    }));
  }

  async findById(id: string): Promise<Performance> {
    const result = await this.prisma.performance.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        goals: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Performance with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      date: result.date,
      rating: result.rating,
      comments: result.comments,
      goals: result.goals.map((g) => g.id.toString()),
      achievements: result.achievements,
      areasForImprovement: result.areasForImprovement,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Performance[]> {
    const result = await this.prisma.performance.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        goals: true,
      },
    });

    return result.map((performance) => ({
      id: performance.id.toString(),
      employeeId: performance.employeeId.toString(),
      date: performance.date,
      rating: performance.rating,
      comments: performance.comments,
      goals: performance.goals.map((g) => g.id.toString()),
      achievements: performance.achievements,
      areasForImprovement: performance.areasForImprovement,
      createdAt: performance.createdAt,
      updatedAt: performance.updatedAt,
    }));
  }

  async create(data: CreatePerformanceDto): Promise<Performance> {
    const result = await this.prisma.performance.create({
      data: {
        employeeId: parseInt(data.employeeId),
        date: data.date,
        rating: data.rating,
        comments: data.comments,
        goals: {
          connect: data.goals.map((id) => ({ id: parseInt(id) })),
        },
        achievements: data.achievements,
        areasForImprovement: data.areasForImprovement,
      },
      include: {
        employee: true,
        goals: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      date: result.date,
      rating: result.rating,
      comments: result.comments,
      goals: result.goals.map((g) => g.id.toString()),
      achievements: result.achievements,
      areasForImprovement: result.areasForImprovement,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdatePerformanceDto): Promise<Performance> {
    const result = await this.prisma.performance.update({
      where: { id: parseInt(id) },
      data: {
        date: data.date,
        rating: data.rating,
        comments: data.comments,
        goals: {
          set: data.goals.map((id) => ({ id: parseInt(id) })),
        },
        achievements: data.achievements,
        areasForImprovement: data.areasForImprovement,
      },
      include: {
        employee: true,
        goals: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      date: result.date,
      rating: result.rating,
      comments: result.comments,
      goals: result.goals.map((g) => g.id.toString()),
      achievements: result.achievements,
      areasForImprovement: result.areasForImprovement,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.performance.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
