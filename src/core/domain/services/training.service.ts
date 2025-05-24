import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateTrainingDto } from '@application/graphql/dto/create-training.dto';
import { UpdateTrainingDto } from '@application/graphql/dto/update-training.dto';
import { Training } from '@application/graphql/types/training.type';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Training[]> {
    const result = await this.prisma.training.findMany({
      include: {
        skills: true,
        participants: true,
      },
    });

    return result.map((training) => ({
      id: training.id.toString(),
      title: training.title,
      description: training.description,
      type: training.type,
      startDate: training.startDate,
      endDate: training.endDate,
      status: training.status,
      instructor: training.instructor,
      location: training.location,
      maxParticipants: training.maxParticipants,
      skillIds: training.skills.map((s) => s.id.toString()),
      participantIds: training.participants.map((p) => p.id.toString()),
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    }));
  }

  async findById(id: string): Promise<Training> {
    const result = await this.prisma.training.findUnique({
      where: { id: parseInt(id) },
      include: {
        skills: true,
        participants: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      title: result.title,
      description: result.description,
      type: result.type,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      instructor: result.instructor,
      location: result.location,
      maxParticipants: result.maxParticipants,
      skillIds: result.skills.map((s) => s.id.toString()),
      participantIds: result.participants.map((p) => p.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Training[]> {
    const result = await this.prisma.training.findMany({
      where: {
        participants: {
          some: {
            id: parseInt(employeeId),
          },
        },
      },
      include: {
        skills: true,
        participants: true,
      },
    });

    return result.map((training) => ({
      id: training.id.toString(),
      title: training.title,
      description: training.description,
      type: training.type,
      startDate: training.startDate,
      endDate: training.endDate,
      status: training.status,
      instructor: training.instructor,
      location: training.location,
      maxParticipants: training.maxParticipants,
      skillIds: training.skills.map((s) => s.id.toString()),
      participantIds: training.participants.map((p) => p.id.toString()),
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    }));
  }

  async create(data: CreateTrainingDto): Promise<Training> {
    const result = await this.prisma.training.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        instructor: data.instructor,
        location: data.location,
        maxParticipants: data.maxParticipants,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
        participants: {
          connect: data.participantIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        skills: true,
        participants: true,
      },
    });

    return {
      id: result.id.toString(),
      title: result.title,
      description: result.description,
      type: result.type,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      instructor: result.instructor,
      location: result.location,
      maxParticipants: result.maxParticipants,
      skillIds: result.skills.map((s) => s.id.toString()),
      participantIds: result.participants.map((p) => p.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateTrainingDto): Promise<Training> {
    const result = await this.prisma.training.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        instructor: data.instructor,
        location: data.location,
        maxParticipants: data.maxParticipants,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
        participants: {
          set: data.participantIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        skills: true,
        participants: true,
      },
    });

    return {
      id: result.id.toString(),
      title: result.title,
      description: result.description,
      type: result.type,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      instructor: result.instructor,
      location: result.location,
      maxParticipants: result.maxParticipants,
      skillIds: result.skills.map((s) => s.id.toString()),
      participantIds: result.participants.map((p) => p.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.training.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
