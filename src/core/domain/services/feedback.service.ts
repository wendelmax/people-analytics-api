import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateFeedbackDto } from '@application/graphql/dto/create-feedback.dto';
import { UpdateFeedbackDto } from '@application/graphql/dto/update-feedback.dto';
import { Feedback } from '@application/graphql/types/feedback.type';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Feedback[]> {
    const result = await this.prisma.feedback.findMany({
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((feedback) => ({
      id: feedback.id.toString(),
      employeeId: feedback.employeeId.toString(),
      title: feedback.title,
      content: feedback.content,
      type: feedback.type,
      rating: feedback.rating,
      skillIds: feedback.skills.map((s) => s.id.toString()),
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  }

  async findById(id: string): Promise<Feedback> {
    const result = await this.prisma.feedback.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      content: result.content,
      type: result.type,
      rating: result.rating,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Feedback[]> {
    const result = await this.prisma.feedback.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((feedback) => ({
      id: feedback.id.toString(),
      employeeId: feedback.employeeId.toString(),
      title: feedback.title,
      content: feedback.content,
      type: feedback.type,
      rating: feedback.rating,
      skillIds: feedback.skills.map((s) => s.id.toString()),
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  }

  async create(data: CreateFeedbackDto): Promise<Feedback> {
    const result = await this.prisma.feedback.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        content: data.content,
        type: data.type,
        rating: data.rating,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      content: result.content,
      type: result.type,
      rating: result.rating,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateFeedbackDto): Promise<Feedback> {
    const result = await this.prisma.feedback.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        rating: data.rating,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      content: result.content,
      type: result.type,
      rating: result.rating,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.feedback.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
