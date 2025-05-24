import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateOnboardingDto } from '@application/graphql/dto/create-onboarding.dto';
import { UpdateOnboardingDto } from '@application/graphql/dto/update-onboarding.dto';
import { Onboarding } from '@application/graphql/types/onboarding.type';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Onboarding[]> {
    const result = await this.prisma.onboarding.findMany({
      include: {
        employee: true,
        tasks: true,
      },
    });

    return result.map((onboarding) => ({
      id: onboarding.id.toString(),
      employeeId: onboarding.employeeId.toString(),
      startDate: onboarding.startDate,
      endDate: onboarding.endDate,
      status: onboarding.status,
      mentorId: onboarding.mentorId?.toString(),
      notes: onboarding.notes,
      taskIds: onboarding.tasks.map((t) => t.id.toString()),
      createdAt: onboarding.createdAt,
      updatedAt: onboarding.updatedAt,
    }));
  }

  async findById(id: string): Promise<Onboarding> {
    const result = await this.prisma.onboarding.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        tasks: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Onboarding with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      mentorId: result.mentorId?.toString(),
      notes: result.notes,
      taskIds: result.tasks.map((t) => t.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Onboarding[]> {
    const result = await this.prisma.onboarding.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        tasks: true,
      },
    });

    return result.map((onboarding) => ({
      id: onboarding.id.toString(),
      employeeId: onboarding.employeeId.toString(),
      startDate: onboarding.startDate,
      endDate: onboarding.endDate,
      status: onboarding.status,
      mentorId: onboarding.mentorId?.toString(),
      notes: onboarding.notes,
      taskIds: onboarding.tasks.map((t) => t.id.toString()),
      createdAt: onboarding.createdAt,
      updatedAt: onboarding.updatedAt,
    }));
  }

  async create(data: CreateOnboardingDto): Promise<Onboarding> {
    const result = await this.prisma.onboarding.create({
      data: {
        employeeId: parseInt(data.employeeId),
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        mentorId: data.mentorId ? parseInt(data.mentorId) : undefined,
        notes: data.notes,
        tasks: {
          connect: data.taskIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        tasks: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      mentorId: result.mentorId?.toString(),
      notes: result.notes,
      taskIds: result.tasks.map((t) => t.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateOnboardingDto): Promise<Onboarding> {
    const result = await this.prisma.onboarding.update({
      where: { id: parseInt(id) },
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        mentorId: data.mentorId ? parseInt(data.mentorId) : undefined,
        notes: data.notes,
        tasks: {
          set: data.taskIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        tasks: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      mentorId: result.mentorId?.toString(),
      notes: result.notes,
      taskIds: result.tasks.map((t) => t.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.onboarding.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
