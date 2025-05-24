import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateLeaveDto } from '@application/graphql/dto/create-leave.dto';
import { UpdateLeaveDto } from '@application/graphql/dto/update-leave.dto';
import { Leave } from '@application/graphql/types/leave.type';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Leave[]> {
    const result = await this.prisma.leave.findMany({
      include: {
        employee: true,
      },
    });

    return result.map((leave) => ({
      id: leave.id.toString(),
      employeeId: leave.employeeId.toString(),
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      reason: leave.reason,
      approvedBy: leave.approvedBy,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
    }));
  }

  async findById(id: string): Promise<Leave> {
    const result = await this.prisma.leave.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      reason: result.reason,
      approvedBy: result.approvedBy,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Leave[]> {
    const result = await this.prisma.leave.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
      },
    });

    return result.map((leave) => ({
      id: leave.id.toString(),
      employeeId: leave.employeeId.toString(),
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      reason: leave.reason,
      approvedBy: leave.approvedBy,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
    }));
  }

  async create(data: CreateLeaveDto): Promise<Leave> {
    const result = await this.prisma.leave.create({
      data: {
        employeeId: parseInt(data.employeeId),
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
        approvedBy: data.approvedBy,
      },
      include: {
        employee: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      reason: result.reason,
      approvedBy: result.approvedBy,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateLeaveDto): Promise<Leave> {
    const result = await this.prisma.leave.update({
      where: { id: parseInt(id) },
      data: {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
        approvedBy: data.approvedBy,
      },
      include: {
        employee: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      reason: result.reason,
      approvedBy: result.approvedBy,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.leave.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
