import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateOnboardingDto, UpdateOnboardingDto } from '@application/api/dto/onboarding.dto';
import { OnboardingStatus, Prisma } from '@prisma/client';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OnboardingModel[]> {
    const onboardings = await this.prisma.onboarding.findMany({
      include: {
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return onboardings.map((onboarding) => this.mapToModel(onboarding));
  }

  async findById(id: string): Promise<OnboardingModel> {
    const onboarding = await this.prisma.onboarding.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!onboarding) {
      throw new NotFoundException(`Onboarding with ID ${id} not found`);
    }

    return this.mapToModel(onboarding);
  }

  async findByEmployee(employeeId: string): Promise<OnboardingModel[]> {
    const onboardings = await this.prisma.onboarding.findMany({
      where: { employeeId },
      include: {
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return onboardings.map((onboarding) => this.mapToModel(onboarding));
  }

  async create(data: CreateOnboardingDto): Promise<OnboardingModel> {
    const onboarding = await this.prisma.onboarding.create({
      data: {
        employeeId: data.employeeId,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        tasks: data.tasks?.length
          ? {
              create: data.tasks.map((task) => ({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
              })),
            }
          : undefined,
      },
      include: {
        tasks: true,
      },
    });

    return this.mapToModel(onboarding);
  }

  async update(id: string, data: UpdateOnboardingDto): Promise<OnboardingModel> {
    await this.ensureExists(id);

    const onboarding = await this.prisma.onboarding.update({
      where: { id },
      data: {
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        tasks: data.tasks
          ? {
              deleteMany: {},
              create: data.tasks.map((task) => ({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
              })),
            }
          : undefined,
      },
      include: {
        tasks: true,
      },
    });

    return this.mapToModel(onboarding);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.onboarding.delete({ where: { id } });
    return true;
  }

  private mapToModel(onboarding: OnboardingWithRelations): OnboardingModel {
    return {
      id: onboarding.id,
      employeeId: onboarding.employeeId,
      status: onboarding.status,
      startDate: onboarding.startDate ?? undefined,
      completedAt: onboarding.completedAt ?? undefined,
      tasks: onboarding.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        dueDate: task.dueDate ?? undefined,
        completedAt: task.completedAt ?? undefined,
      })),
      createdAt: onboarding.createdAt,
      updatedAt: onboarding.updatedAt,
    };
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.onboarding.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Onboarding with ID ${id} not found`);
    }
  }
}

type OnboardingWithRelations = Prisma.OnboardingGetPayload<{
  include: {
    tasks: true;
  };
}>;

export type OnboardingModel = {
  id: string;
  employeeId: string;
  status: OnboardingStatus;
  startDate?: Date;
  completedAt?: Date;
  tasks: {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    completedAt?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
