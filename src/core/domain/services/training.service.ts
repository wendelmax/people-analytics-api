import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateTrainingDto, UpdateTrainingDto } from '@application/api/dto/training.dto';
import { TrainingStatus, TrainingType, Prisma } from '@prisma/client';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TrainingModel[]> {
    const trainings = await this.prisma.training.findMany({
      include: {
        skills: true,
        participants: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return trainings.map((training) => this.mapToModel(training));
  }

  async findById(id: string): Promise<TrainingModel> {
    const training = await this.prisma.training.findUnique({
      where: { id },
      include: {
        skills: true,
        participants: true,
      },
    });

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    return this.mapToModel(training);
  }

  async findByEmployeeId(employeeId: string): Promise<TrainingModel[]> {
    const trainings = await this.prisma.training.findMany({
      where: {
        participants: {
          some: {
            employeeId,
          },
        },
      },
      include: {
        skills: true,
        participants: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return trainings.map((training) => this.mapToModel(training));
  }

  async create(data: CreateTrainingDto): Promise<TrainingModel> {
    const training = await this.prisma.training.create({
      data: {
        name: data.name,
        description: data.description,
        provider: data.provider,
        type: data.type,
        status: data.status,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        difficulty: data.difficulty,
        skills: data.skillIds?.length
          ? {
              create: data.skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
        participants: data.participants?.length
          ? {
              create: data.participants.map((participant) => ({
                employeeId: participant.employeeId,
                status: participant.status,
                startedAt: new Date(participant.startedAt),
                completedAt: participant.completedAt
                  ? new Date(participant.completedAt)
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        skills: true,
        participants: true,
      },
    });

    return this.mapToModel(training);
  }

  async update(id: string, data: UpdateTrainingDto): Promise<TrainingModel> {
    await this.ensureExists(id);

    const training = await this.prisma.training.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        provider: data.provider,
        type: data.type,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        difficulty: data.difficulty,
        skills: data.skillIds
          ? {
              deleteMany: {},
              create: data.skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
        participants: data.participants
          ? {
              deleteMany: {},
              create: data.participants.map((participant) => ({
                employeeId: participant.employeeId,
                status: participant.status,
                startedAt: new Date(participant.startedAt),
                completedAt: participant.completedAt
                  ? new Date(participant.completedAt)
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        skills: true,
        participants: true,
      },
    });

    return this.mapToModel(training);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.training.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.training.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }
  }

  private mapToModel(training: TrainingWithRelations): TrainingModel {
    return {
      id: training.id,
      name: training.name,
      description: training.description ?? undefined,
      provider: training.provider ?? undefined,
      type: training.type,
      status: training.status,
      startDate: training.startDate,
      endDate: training.endDate ?? undefined,
      difficulty: training.difficulty ?? undefined,
      skillIds: training.skills.map((link) => link.skillId),
      participants: training.participants.map((participant) => ({
        id: participant.id,
        employeeId: participant.employeeId,
        status: participant.status,
        startedAt: participant.startedAt,
        completedAt: participant.completedAt ?? undefined,
      })),
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    };
  }
}

type TrainingWithRelations = Prisma.TrainingGetPayload<{
  include: {
    skills: true;
    participants: true;
  };
}>;

export type TrainingModel = {
  id: string;
  name: string;
  description?: string;
  provider?: string;
  type: TrainingType;
  status: TrainingStatus;
  startDate: Date;
  endDate?: Date;
  difficulty?: string;
  skillIds: string[];
  participants: Array<{
    id: string;
    employeeId: string;
    status: TrainingStatus;
    startedAt: Date;
    completedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};
