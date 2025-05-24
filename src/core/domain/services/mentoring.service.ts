import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateMentoringInput } from '@application/graphql/inputs/create-mentoring.input';
import { UpdateMentoringInput } from '@application/graphql/inputs/update-mentoring.input';
import { Mentoring } from '@application/graphql/types/mentoring.type';

@Injectable()
export class MentoringService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Mentoring[]> {
    const result = await this.prisma.mentoring.findMany({
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return result.map((mentoring) => ({
      id: mentoring.id,
      mentorId: mentoring.mentorId,
      menteeId: mentoring.menteeId,
      startDate: mentoring.startDate,
      endDate: mentoring.endDate,
      status: mentoring.status,
      goals: mentoring.goals,
      notes: mentoring.notes,
      createdAt: mentoring.createdAt,
      updatedAt: mentoring.updatedAt,
    }));
  }

  async findById(id: string): Promise<Mentoring> {
    const result = await this.prisma.mentoring.findUnique({
      where: { id },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Mentoring with ID ${id} not found`);
    }

    return {
      id: result.id,
      mentorId: result.mentorId,
      menteeId: result.menteeId,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      goals: result.goals,
      notes: result.notes,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByMentorId(mentorId: string): Promise<Mentoring[]> {
    const result = await this.prisma.mentoring.findMany({
      where: {
        mentorId,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return result.map((mentoring) => ({
      id: mentoring.id,
      mentorId: mentoring.mentorId,
      menteeId: mentoring.menteeId,
      startDate: mentoring.startDate,
      endDate: mentoring.endDate,
      status: mentoring.status,
      goals: mentoring.goals,
      notes: mentoring.notes,
      createdAt: mentoring.createdAt,
      updatedAt: mentoring.updatedAt,
    }));
  }

  async findByMenteeId(menteeId: string): Promise<Mentoring[]> {
    const result = await this.prisma.mentoring.findMany({
      where: {
        menteeId,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return result.map((mentoring) => ({
      id: mentoring.id,
      mentorId: mentoring.mentorId,
      menteeId: mentoring.menteeId,
      startDate: mentoring.startDate,
      endDate: mentoring.endDate,
      status: mentoring.status,
      goals: mentoring.goals,
      notes: mentoring.notes,
      createdAt: mentoring.createdAt,
      updatedAt: mentoring.updatedAt,
    }));
  }

  async create(data: CreateMentoringInput): Promise<Mentoring> {
    const result = await this.prisma.mentoring.create({
      data: {
        mentorId: parseInt(data.mentorId),
        menteeId: parseInt(data.menteeId),
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        goals: data.goals,
        notes: data.notes,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return {
      id: result.id,
      mentorId: result.mentorId,
      menteeId: result.menteeId,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      goals: result.goals,
      notes: result.notes,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateMentoringInput): Promise<Mentoring> {
    const result = await this.prisma.mentoring.update({
      where: { id },
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        goals: data.goals,
        notes: data.notes,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return {
      id: result.id,
      mentorId: result.mentorId,
      menteeId: result.menteeId,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      goals: result.goals,
      notes: result.notes,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.mentoring.delete({
      where: { id },
    });
    return { success: true };
  }
}
