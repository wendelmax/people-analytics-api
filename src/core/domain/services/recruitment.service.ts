import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateRecruitmentDto } from '@application/graphql/dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from '@application/graphql/dto/update-recruitment.dto';
import { Recruitment } from '@application/graphql/types/recruitment.type';

@Injectable()
export class RecruitmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Recruitment[]> {
    const result = await this.prisma.recruitment.findMany({
      include: {
        position: true,
        candidates: true,
      },
    });

    return result.map((recruitment) => ({
      id: recruitment.id.toString(),
      positionId: recruitment.positionId.toString(),
      title: recruitment.title,
      description: recruitment.description,
      requirements: recruitment.requirements,
      status: recruitment.status,
      startDate: recruitment.startDate,
      endDate: recruitment.endDate,
      candidateIds: recruitment.candidates.map((c) => c.id.toString()),
      createdAt: recruitment.createdAt,
      updatedAt: recruitment.updatedAt,
    }));
  }

  async findById(id: string): Promise<Recruitment> {
    const result = await this.prisma.recruitment.findUnique({
      where: { id: parseInt(id) },
      include: {
        position: true,
        candidates: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Recruitment with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      positionId: result.positionId.toString(),
      title: result.title,
      description: result.description,
      requirements: result.requirements,
      status: result.status,
      startDate: result.startDate,
      endDate: result.endDate,
      candidateIds: result.candidates.map((c) => c.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByPositionId(positionId: string): Promise<Recruitment[]> {
    const result = await this.prisma.recruitment.findMany({
      where: {
        positionId: parseInt(positionId),
      },
      include: {
        position: true,
        candidates: true,
      },
    });

    return result.map((recruitment) => ({
      id: recruitment.id.toString(),
      positionId: recruitment.positionId.toString(),
      title: recruitment.title,
      description: recruitment.description,
      requirements: recruitment.requirements,
      status: recruitment.status,
      startDate: recruitment.startDate,
      endDate: recruitment.endDate,
      candidateIds: recruitment.candidates.map((c) => c.id.toString()),
      createdAt: recruitment.createdAt,
      updatedAt: recruitment.updatedAt,
    }));
  }

  async create(data: CreateRecruitmentDto): Promise<Recruitment> {
    const result = await this.prisma.recruitment.create({
      data: {
        positionId: parseInt(data.positionId),
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        candidates: {
          connect: data.candidateIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        position: true,
        candidates: true,
      },
    });

    return {
      id: result.id.toString(),
      positionId: result.positionId.toString(),
      title: result.title,
      description: result.description,
      requirements: result.requirements,
      status: result.status,
      startDate: result.startDate,
      endDate: result.endDate,
      candidateIds: result.candidates.map((c) => c.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateRecruitmentDto): Promise<Recruitment> {
    const result = await this.prisma.recruitment.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        candidates: {
          set: data.candidateIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        position: true,
        candidates: true,
      },
    });

    return {
      id: result.id.toString(),
      positionId: result.positionId.toString(),
      title: result.title,
      description: result.description,
      requirements: result.requirements,
      status: result.status,
      startDate: result.startDate,
      endDate: result.endDate,
      candidateIds: result.candidates.map((c) => c.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.recruitment.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
