import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateDevelopmentPlanDto,
  UpdateDevelopmentPlanDto,
} from '@application/api/dto/development-plan.dto';
import { DevelopmentPlanStatus, DevelopmentItemStatus, Prisma } from '@prisma/client';

@Injectable()
export class DevelopmentPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DevelopmentPlanModel[]> {
    const plans = await this.prisma.developmentPlan.findMany({
      include: {
        employee: true,
        items: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return plans.map((plan) => this.mapToModel(plan));
  }

  async findById(id: string): Promise<DevelopmentPlanModel> {
    const plan = await this.prisma.developmentPlan.findUnique({
      where: { id },
      include: {
        employee: true,
        items: true,
      },
    });

    if (!plan) {
      throw new NotFoundException(`Development plan with ID ${id} not found`);
    }

    return this.mapToModel(plan);
  }

  async findByEmployeeId(employeeId: string): Promise<DevelopmentPlanModel[]> {
    const plans = await this.prisma.developmentPlan.findMany({
      where: { employeeId },
      include: {
        employee: true,
        items: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return plans.map((plan) => this.mapToModel(plan));
  }

  async create(data: CreateDevelopmentPlanDto): Promise<DevelopmentPlanModel> {
    const plan = await this.prisma.developmentPlan.create({
      data: {
        employeeId: data.employeeId,
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: new Date(data.startDate),
        targetDate: new Date(data.targetDate),
        items: data.items?.length
          ? {
              create: data.items.map((item) => ({
                title: item.title,
                description: item.description,
                status: item.status,
                skillId: item.skillId,
                dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
              })),
            }
          : undefined,
      },
      include: {
        employee: true,
        items: true,
      },
    });

    return this.mapToModel(plan);
  }

  async update(id: string, data: UpdateDevelopmentPlanDto): Promise<DevelopmentPlanModel> {
    await this.ensureExists(id);

    const plan = await this.prisma.developmentPlan.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        items: data.items
          ? {
              deleteMany: {},
              create: data.items.map((item) => ({
                title: item.title,
                description: item.description,
                status: item.status,
                skillId: item.skillId,
                dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
              })),
            }
          : undefined,
      },
      include: {
        employee: true,
        items: true,
      },
    });

    return this.mapToModel(plan);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.developmentPlan.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.developmentPlan.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Development plan with ID ${id} not found`);
    }
  }

  private mapToModel(plan: DevelopmentPlanWithRelations): DevelopmentPlanModel {
    return {
      id: plan.id,
      employeeId: plan.employeeId,
      title: plan.title,
      description: plan.description ?? undefined,
      status: plan.status,
      startDate: plan.startDate,
      targetDate: plan.targetDate,
      items: plan.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? undefined,
        status: item.status,
        skillId: item.skillId ?? undefined,
        dueDate: item.dueDate ?? undefined,
      })),
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}

type DevelopmentPlanWithRelations = Prisma.DevelopmentPlanGetPayload<{
  include: {
    employee: true;
    items: true;
  };
}>;

export type DevelopmentPlanModel = {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  status: DevelopmentPlanStatus;
  startDate: Date;
  targetDate: Date;
  items: Array<{
    id: string;
    title: string;
    description?: string;
    status: DevelopmentItemStatus;
    skillId?: string;
    dueDate?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};
