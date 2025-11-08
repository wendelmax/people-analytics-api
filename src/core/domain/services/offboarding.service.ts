import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateOffboardingDto, UpdateOffboardingDto } from '@application/api/dto/offboarding.dto';
import { OffboardingStatus, Prisma } from '@prisma/client';

@Injectable()
export class OffboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OffboardingModel[]> {
    const offboardings = await this.prisma.offboarding.findMany({
      include: {
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return offboardings.map((offboarding) => this.mapToModel(offboarding));
  }

  async findById(id: string): Promise<OffboardingModel> {
    const offboarding = await this.prisma.offboarding.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!offboarding) {
      throw new NotFoundException(`Offboarding with ID ${id} not found`);
    }

    return this.mapToModel(offboarding);
  }

  async findByEmployee(employeeId: string): Promise<OffboardingModel[]> {
    const offboardings = await this.prisma.offboarding.findMany({
      where: { employeeId },
      include: {
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return offboardings.map((offboarding) => this.mapToModel(offboarding));
  }

  async create(data: CreateOffboardingDto): Promise<OffboardingModel> {
    const offboarding = await this.prisma.offboarding.create({
      data: {
        employeeId: data.employeeId,
        status: data.status,
        exitDate: data.exitDate ? new Date(data.exitDate) : undefined,
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

    return this.mapToModel(offboarding);
  }

  async update(id: string, data: UpdateOffboardingDto): Promise<OffboardingModel> {
    await this.ensureExists(id);

    const offboarding = await this.prisma.offboarding.update({
      where: { id },
      data: {
        status: data.status,
        exitDate: data.exitDate ? new Date(data.exitDate) : undefined,
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

    return this.mapToModel(offboarding);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.offboarding.delete({ where: { id } });
    return true;
  }

  private mapToModel(offboarding: OffboardingWithRelations): OffboardingModel {
    return {
      id: offboarding.id,
      employeeId: offboarding.employeeId,
      status: offboarding.status,
      exitDate: offboarding.exitDate ?? undefined,
      completedAt: offboarding.completedAt ?? undefined,
      tasks: offboarding.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        dueDate: task.dueDate ?? undefined,
        completedAt: task.completedAt ?? undefined,
      })),
      createdAt: offboarding.createdAt,
      updatedAt: offboarding.updatedAt,
    };
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.offboarding.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Offboarding with ID ${id} not found`);
    }
  }
}

type OffboardingWithRelations = Prisma.OffboardingGetPayload<{
  include: {
    tasks: true;
  };
}>;

export type OffboardingModel = {
  id: string;
  employeeId: string;
  status: OffboardingStatus;
  exitDate?: Date;
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
