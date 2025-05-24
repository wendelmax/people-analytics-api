import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateDevelopmentPlanInput } from '@application/graphql/inputs/create-development-plan.input';
import { UpdateDevelopmentPlanInput } from '@application/graphql/inputs/update-development-plan.input';
import { DevelopmentPlan } from '@application/graphql/types/development-plan.type';

@Injectable()
export class DevelopmentPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DevelopmentPlan[]> {
    const result = await this.prisma.developmentPlan.findMany({
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((plan) => ({
      id: plan.id.toString(),
      employeeId: plan.employeeId.toString(),
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate,
      endDate: plan.endDate,
      status: plan.status,
      goals: plan.goals,
      skillIds: plan.skills.map((s) => s.id.toString()),
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  async findById(id: string): Promise<DevelopmentPlan> {
    const result = await this.prisma.developmentPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Development plan with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      goals: result.goals,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<DevelopmentPlan[]> {
    const result = await this.prisma.developmentPlan.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        skills: true,
        trainings: true,
      },
    });

    return result.map((plan) => ({
      id: plan.id.toString(),
      employeeId: plan.employeeId.toString(),
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate,
      endDate: plan.endDate,
      status: plan.status,
      skillIds: plan.skills.map((s) => s.id.toString()),
      trainingIds: plan.trainings.map((t) => t.id.toString()),
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  async create(data: CreateDevelopmentPlanInput): Promise<DevelopmentPlan> {
    const result = await this.prisma.developmentPlan.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        goals: data.goals,
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
      goals: result.goals,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateDevelopmentPlanInput): Promise<DevelopmentPlan> {
    const result = await this.prisma.developmentPlan.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        goals: data.goals,
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
      goals: result.goals,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.developmentPlan.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
