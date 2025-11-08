import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from '@application/api/dto/goal.dto';
import { GoalPriority, GoalStatus, GoalType, Prisma } from '@prisma/client';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<GoalModel[]> {
    const goals = await this.prisma.goal.findMany({
      include: {
        employee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return goals.map((goal) => this.mapToModel(goal));
  }

  async findById(id: string): Promise<GoalModel> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return this.mapToModel(goal);
  }

  async findByEmployeeId(employeeId: string): Promise<GoalModel[]> {
    const goals = await this.prisma.goal.findMany({
      where: { employeeId },
      include: {
        employee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return goals.map((goal) => this.mapToModel(goal));
  }

  async create(data: CreateGoalDto): Promise<GoalModel> {
    const goal = await this.prisma.goal.create({
      data: {
        employeeId: data.employeeId,
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        startDate: new Date(data.startDate),
        targetDate: new Date(data.targetDate),
        progress: data.progress,
      },
      include: {
        employee: true,
      },
    });

    return this.mapToModel(goal);
  }

  async update(id: string, data: UpdateGoalDto): Promise<GoalModel> {
    await this.ensureExists(id);

    const goal = await this.prisma.goal.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        progress: data.progress,
      },
      include: {
        employee: true,
      },
    });

    return this.mapToModel(goal);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.goal.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.goal.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
  }

  private mapToModel(goal: GoalWithRelations): GoalModel {
    return {
      id: goal.id,
      employeeId: goal.employeeId,
      title: goal.title,
      description: goal.description ?? undefined,
      type: goal.type,
      priority: goal.priority,
      status: goal.status,
      startDate: goal.startDate,
      targetDate: goal.targetDate,
      progress: goal.progress,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
  }
}

type GoalWithRelations = Prisma.GoalGetPayload<{
  include: {
    employee: true;
  };
}>;

export type GoalModel = {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  type: GoalType;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: Date;
  targetDate: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};
