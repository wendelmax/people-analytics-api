import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateInterviewDto } from '@application/graphql/dto/create-interview.dto';
import { UpdateInterviewDto } from '@application/graphql/dto/update-interview.dto';
import { Interview } from '@application/graphql/types/interview.type';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Interview[]> {
    const result = await this.prisma.interview.findMany({
      include: {
        employee: true,
        interviewer: true,
        skills: true,
      },
    });

    return result.map((interview) => ({
      id: interview.id.toString(),
      employeeId: interview.employeeId.toString(),
      interviewerId: interview.interviewerId.toString(),
      type: interview.type,
      date: interview.date,
      status: interview.status,
      notes: interview.notes,
      rating: interview.rating,
      skillIds: interview.skills.map((s) => s.id.toString()),
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    }));
  }

  async findById(id: string): Promise<Interview> {
    const result = await this.prisma.interview.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        interviewer: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      interviewerId: result.interviewerId.toString(),
      type: result.type,
      date: result.date,
      status: result.status,
      notes: result.notes,
      rating: result.rating,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Interview[]> {
    const result = await this.prisma.interview.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        interviewer: true,
        skills: true,
      },
    });

    return result.map((interview) => ({
      id: interview.id.toString(),
      employeeId: interview.employeeId.toString(),
      interviewerId: interview.interviewerId.toString(),
      type: interview.type,
      date: interview.date,
      status: interview.status,
      notes: interview.notes,
      rating: interview.rating,
      skillIds: interview.skills.map((s) => s.id.toString()),
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    }));
  }

  async create(data: CreateInterviewDto): Promise<Interview> {
    const result = await this.prisma.interview.create({
      data: {
        employeeId: parseInt(data.employeeId),
        interviewerId: parseInt(data.interviewerId),
        type: data.type,
        date: data.date,
        status: data.status,
        notes: data.notes,
        rating: data.rating,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        interviewer: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      interviewerId: result.interviewerId.toString(),
      type: result.type,
      date: result.date,
      status: result.status,
      notes: result.notes,
      rating: result.rating,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateInterviewDto): Promise<Interview> {
    const result = await this.prisma.interview.update({
      where: { id: parseInt(id) },
      data: {
        interviewerId: data.interviewerId ? parseInt(data.interviewerId) : undefined,
        type: data.type,
        date: data.date,
        status: data.status,
        notes: data.notes,
        rating: data.rating,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        interviewer: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      interviewerId: result.interviewerId.toString(),
      type: result.type,
      date: result.date,
      status: result.status,
      notes: result.notes,
      rating: result.rating,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.interview.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
