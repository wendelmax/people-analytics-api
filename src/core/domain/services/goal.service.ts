import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateGoalDto } from '@application/graphql/dto/create-goal.dto';
import { UpdateGoalDto } from '@application/graphql/dto/update-goal.dto';
import { Goal } from '@application/graphql/types/goal.type';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Goal[]> {
    const result = await this.prisma.goal.findMany({
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((goal) => ({
      id: goal.id.toString(),
      employeeId: goal.employeeId.toString(),
      title: goal.title,
      description: goal.description,
      startDate: goal.startDate,
      endDate: goal.endDate,
      status: goal.status,
      priority: goal.priority,
      progress: goal.progress,
      skillIds: goal.skills.map((s) => s.id.toString()),
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }));
  }

  async findById(id: string): Promise<Goal> {
    const result = await this.prisma.goal.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      priority: result.priority,
      progress: result.progress,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Goal[]> {
    const result = await this.prisma.goal.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((goal) => ({
      id: goal.id.toString(),
      employeeId: goal.employeeId.toString(),
      title: goal.title,
      description: goal.description,
      startDate: goal.startDate,
      endDate: goal.endDate,
      status: goal.status,
      priority: goal.priority,
      progress: goal.progress,
      skillIds: goal.skills.map((s) => s.id.toString()),
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }));
  }

  async create(data: CreateGoalDto): Promise<Goal> {
    const result = await this.prisma.goal.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
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
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      priority: result.priority,
      progress: result.progress,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateGoalDto): Promise<Goal> {
    const result = await this.prisma.goal.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
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
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      priority: result.priority,
      progress: result.progress,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.goal.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
