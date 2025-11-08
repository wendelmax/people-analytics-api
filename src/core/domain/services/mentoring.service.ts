import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateMentoringDto, UpdateMentoringDto } from '@application/api/dto/mentoring.dto';
import { MentoringStatus, Prisma } from '@prisma/client';

@Injectable()
export class MentoringService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MentoringModel[]> {
    const relationships = await this.prisma.mentoringRelationship.findMany({
      include: {
        mentor: true,
        mentee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return relationships.map((relationship) => this.mapToModel(relationship));
  }

  async findById(id: string): Promise<MentoringModel> {
    const relationship = await this.prisma.mentoringRelationship.findUnique({
      where: { id },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    if (!relationship) {
      throw new NotFoundException(`Mentoring relationship with ID ${id} not found`);
    }

    return this.mapToModel(relationship);
  }

  async findByMentorId(mentorId: string): Promise<MentoringModel[]> {
    const relationships = await this.prisma.mentoringRelationship.findMany({
      where: { mentorId },
      include: {
        mentor: true,
        mentee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return relationships.map((relationship) => this.mapToModel(relationship));
  }

  async findByMenteeId(menteeId: string): Promise<MentoringModel[]> {
    const relationships = await this.prisma.mentoringRelationship.findMany({
      where: { menteeId },
      include: {
        mentor: true,
        mentee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return relationships.map((relationship) => this.mapToModel(relationship));
  }

  async create(data: CreateMentoringDto): Promise<MentoringModel> {
    const relationship = await this.prisma.mentoringRelationship.create({
      data: {
        mentorId: data.mentorId,
        menteeId: data.menteeId,
        status: data.status,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        goals: data.goals ?? [],
        notes: data.notes,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return this.mapToModel(relationship);
  }

  async update(id: string, data: UpdateMentoringDto): Promise<MentoringModel> {
    await this.ensureExists(id);

    const relationship = await this.prisma.mentoringRelationship.update({
      where: { id },
      data: {
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        goals: data.goals,
        notes: data.notes,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    return this.mapToModel(relationship);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.mentoringRelationship.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.mentoringRelationship.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Mentoring relationship with ID ${id} not found`);
    }
  }

  private mapToModel(relationship: MentoringWithRelations): MentoringModel {
    return {
      id: relationship.id,
      mentorId: relationship.mentorId,
      menteeId: relationship.menteeId,
      status: relationship.status,
      startDate: relationship.startDate,
      endDate: relationship.endDate ?? undefined,
      goals: relationship.goals,
      notes: relationship.notes ?? undefined,
    };
  }
}

type MentoringWithRelations = Prisma.MentoringRelationshipGetPayload<{
  include: {
    mentor: true;
    mentee: true;
  };
}>;

export type MentoringModel = {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentoringStatus;
  startDate: Date;
  endDate?: Date;
  goals: string[];
  notes?: string;
};
