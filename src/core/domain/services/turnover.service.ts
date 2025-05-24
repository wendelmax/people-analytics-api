import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateTurnoverDto } from '@application/graphql/dto/create-turnover.dto';
import { UpdateTurnoverDto } from '@application/graphql/dto/update-turnover.dto';
import { Turnover } from '@application/graphql/types/turnover.type';

@Injectable()
export class TurnoverService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Turnover[]> {
    const result = await this.prisma.turnover.findMany({
      include: {
        employee: true,
      },
    });

    return result.map((turnover) => ({
      id: turnover.id.toString(),
      employeeId: turnover.employeeId.toString(),
      type: turnover.type,
      reason: turnover.reason,
      date: turnover.date,
      status: turnover.status,
      exitInterview: turnover.exitInterview,
      feedback: turnover.feedback,
      createdAt: turnover.createdAt,
      updatedAt: turnover.updatedAt,
    }));
  }

  async findById(id: string): Promise<Turnover> {
    const result = await this.prisma.turnover.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Turnover with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      reason: result.reason,
      date: result.date,
      status: result.status,
      exitInterview: result.exitInterview,
      feedback: result.feedback,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Turnover[]> {
    const result = await this.prisma.turnover.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
      },
    });

    return result.map((turnover) => ({
      id: turnover.id.toString(),
      employeeId: turnover.employeeId.toString(),
      type: turnover.type,
      reason: turnover.reason,
      date: turnover.date,
      status: turnover.status,
      exitInterview: turnover.exitInterview,
      feedback: turnover.feedback,
      createdAt: turnover.createdAt,
      updatedAt: turnover.updatedAt,
    }));
  }

  async create(data: CreateTurnoverDto): Promise<Turnover> {
    const result = await this.prisma.turnover.create({
      data: {
        employeeId: parseInt(data.employeeId),
        type: data.type,
        reason: data.reason,
        date: data.date,
        status: data.status,
        exitInterview: data.exitInterview,
        feedback: data.feedback,
      },
      include: {
        employee: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      reason: result.reason,
      date: result.date,
      status: result.status,
      exitInterview: result.exitInterview,
      feedback: result.feedback,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateTurnoverDto): Promise<Turnover> {
    const result = await this.prisma.turnover.update({
      where: { id: parseInt(id) },
      data: {
        type: data.type,
        reason: data.reason,
        date: data.date,
        status: data.status,
        exitInterview: data.exitInterview,
        feedback: data.feedback,
      },
      include: {
        employee: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      reason: result.reason,
      date: result.date,
      status: result.status,
      exitInterview: result.exitInterview,
      feedback: result.feedback,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.turnover.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
