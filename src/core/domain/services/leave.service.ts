import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
} from '@application/api/dto/leave.dto';
import { LeaveStatus } from '@prisma/client';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async createLeaveType(dto: CreateLeaveTypeDto) {
    const existing = await this.prisma.leaveType.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Leave type with code ${dto.code} already exists`);
    }

    return this.prisma.leaveType.create({
      data: {
        name: dto.name,
        code: dto.code,
        maxDays: dto.maxDays,
        carryForward: dto.carryForward ?? false,
        requiresApproval: dto.requiresApproval ?? true,
      },
    });
  }

  async findAllLeaveTypes() {
    return this.prisma.leaveType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findLeaveTypeById(id: string) {
    const leaveType = await this.prisma.leaveType.findUnique({
      where: { id },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }

    return leaveType;
  }

  async updateLeaveType(id: string, dto: UpdateLeaveTypeDto) {
    await this.findLeaveTypeById(id);

    return this.prisma.leaveType.update({
      where: { id },
      data: dto,
    });
  }

  async deleteLeaveType(id: string) {
    await this.findLeaveTypeById(id);

    await this.prisma.leaveType.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createLeaveRequest(employeeId: string, dto: CreateLeaveRequestDto) {
    const leaveType = await this.findLeaveTypeById(dto.leaveTypeId);
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const days = this.calculateDays(startDate, endDate);

    const balance = await this.getLeaveBalance(
      employeeId,
      dto.leaveTypeId,
      new Date().getFullYear(),
    );

    if (balance.balance < days) {
      throw new BadRequestException(
        `Insufficient leave balance. Available: ${balance.balance} days`,
      );
    }

    if (leaveType.maxDays && days > leaveType.maxDays) {
      throw new BadRequestException(
        `Maximum ${leaveType.maxDays} days allowed for this leave type`,
      );
    }

    const leaveRequest = await this.prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveTypeId: dto.leaveTypeId,
        startDate,
        endDate,
        days,
        reason: dto.reason,
        status: leaveType.requiresApproval ? LeaveStatus.PENDING : LeaveStatus.APPROVED,
      },
      include: {
        leaveType: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!leaveType.requiresApproval) {
      await this.updateLeaveBalance(employeeId, dto.leaveTypeId, days);
    }

    return leaveRequest;
  }

  async findAllLeaveRequests(employeeId?: string, status?: LeaveStatus) {
    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        leaveType: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLeaveRequestById(id: string) {
    const leaveRequest = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        leaveType: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }

    return leaveRequest;
  }

  async updateLeaveRequest(id: string, dto: UpdateLeaveRequestDto) {
    const leaveRequest = await this.findLeaveRequestById(id);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be updated');
    }

    const updateData: any = {};

    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }

    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    if (dto.reason !== undefined) {
      updateData.reason = dto.reason;
    }

    if (updateData.startDate || updateData.endDate) {
      const startDate = updateData.startDate || leaveRequest.startDate;
      const endDate = updateData.endDate || leaveRequest.endDate;
      updateData.days = this.calculateDays(startDate, endDate);
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: updateData,
      include: {
        leaveType: true,
        employee: true,
      },
    });
  }

  async approveLeaveRequest(id: string, approverId: string, _dto?: ApproveLeaveRequestDto) {
    const leaveRequest = await this.findLeaveRequestById(id);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be approved');
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.APPROVED,
        approverId,
        approvedAt: new Date(),
      },
      include: {
        leaveType: true,
        employee: true,
      },
    });

    await this.updateLeaveBalance(
      leaveRequest.employeeId,
      leaveRequest.leaveTypeId,
      leaveRequest.days,
    );

    return updated;
  }

  async rejectLeaveRequest(id: string, approverId: string, dto: RejectLeaveRequestDto) {
    const leaveRequest = await this.findLeaveRequestById(id);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be rejected');
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.REJECTED,
        approverId,
        rejectedReason: dto.rejectedReason,
      },
      include: {
        leaveType: true,
        employee: true,
      },
    });
  }

  async cancelLeaveRequest(id: string, employeeId: string) {
    const leaveRequest = await this.findLeaveRequestById(id);

    if (leaveRequest.employeeId !== employeeId) {
      throw new BadRequestException('You can only cancel your own leave requests');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be cancelled');
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.CANCELLED,
      },
    });
  }

  async getLeaveBalance(employeeId: string, leaveTypeId: string, year: number) {
    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId,
          year,
        },
      },
    });

    if (!balance) {
      return this.prisma.leaveBalance.create({
        data: {
          employeeId,
          leaveTypeId,
          year,
          balance: 0,
          accrued: 0,
          used: 0,
        },
      });
    }

    return balance;
  }

  async getEmployeeLeaveBalances(employeeId: string, year?: number) {
    const currentYear = year || new Date().getFullYear();

    return this.prisma.leaveBalance.findMany({
      where: {
        employeeId,
        year: currentYear,
      },
      include: {
        leaveType: true,
      },
    });
  }

  async createLeavePolicy(dto: CreateLeavePolicyDto) {
    await this.findLeaveTypeById(dto.leaveTypeId);

    if (dto.departmentId) {
      await this.prisma.department.findUniqueOrThrow({
        where: { id: dto.departmentId },
      });
    }

    if (dto.positionId) {
      await this.prisma.position.findUniqueOrThrow({
        where: { id: dto.positionId },
      });
    }

    return this.prisma.leavePolicy.create({
      data: dto,
      include: {
        leaveType: true,
        department: true,
        position: true,
      },
    });
  }

  async findAllLeavePolicies() {
    return this.prisma.leavePolicy.findMany({
      include: {
        leaveType: true,
        department: true,
        position: true,
      },
    });
  }

  async updateLeavePolicy(id: string, dto: UpdateLeavePolicyDto) {
    const policy = await this.prisma.leavePolicy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new NotFoundException(`Leave policy with ID ${id} not found`);
    }

    return this.prisma.leavePolicy.update({
      where: { id },
      data: dto,
      include: {
        leaveType: true,
        department: true,
        position: true,
      },
    });
  }

  async deleteLeavePolicy(id: string) {
    await this.prisma.leavePolicy.delete({
      where: { id },
    });
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  private async updateLeaveBalance(employeeId: string, leaveTypeId: string, days: number) {
    const year = new Date().getFullYear();
    const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);

    await this.prisma.leaveBalance.update({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId,
          year,
        },
      },
      data: {
        used: balance.used + days,
        balance: balance.balance - days,
      },
    });
  }
}
