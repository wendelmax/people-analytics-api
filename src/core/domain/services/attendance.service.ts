import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  CheckInDto,
  CheckOutDto,
  CreateWorkScheduleDto,
  UpdateWorkScheduleDto,
} from '@application/api/dto/attendance.dto';
import { AttendanceStatus, Prisma } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttendance(dto: CreateAttendanceDto) {
    const date = new Date(dto.date);
    date.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: dto.employeeId,
          date,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Attendance record already exists for this date');
    }

    const data: Prisma.AttendanceCreateInput = {
      employee: {
        connect: { id: dto.employeeId },
      },
      date,
      status: dto.status || AttendanceStatus.PRESENT,
    };

    if (dto.checkIn) {
      data.checkIn = new Date(dto.checkIn);
    }

    if (dto.checkOut) {
      data.checkOut = new Date(dto.checkOut);
    }

    if (dto.location) {
      data.location = dto.location as Prisma.InputJsonValue;
    }

    if (dto.notes) {
      data.notes = dto.notes;
    }

    if (dto.checkIn && dto.checkOut) {
      data.workHours = this.calculateWorkHours(new Date(dto.checkIn), new Date(dto.checkOut));
    }

    return this.prisma.attendance.create({
      data,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllAttendances(employeeId?: string, startDate?: string, endDate?: string) {
    const where: Prisma.AttendanceWhereInput = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findAttendanceById(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async updateAttendance(id: string, dto: UpdateAttendanceDto) {
    await this.findAttendanceById(id);

    const updateData: Prisma.AttendanceUpdateInput = {};

    if (dto.checkIn) {
      updateData.checkIn = new Date(dto.checkIn);
    }

    if (dto.checkOut) {
      updateData.checkOut = new Date(dto.checkOut);
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    if (dto.workHours !== undefined) {
      updateData.workHours = dto.workHours;
    }

    if (dto.lateMinutes !== undefined) {
      updateData.lateMinutes = dto.lateMinutes;
    }

    if (dto.overtimeHours !== undefined) {
      updateData.overtimeHours = dto.overtimeHours;
    }

    if (dto.location) {
      updateData.location = dto.location as Prisma.InputJsonValue;
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (updateData.checkIn || updateData.checkOut) {
      const checkIn = updateData.checkIn ? (updateData.checkIn as Date) : attendance?.checkIn;
      const checkOut = updateData.checkOut ? (updateData.checkOut as Date) : attendance?.checkOut;

      if (checkIn && checkOut) {
        updateData.workHours = this.calculateWorkHours(checkIn, checkOut);
      }
    }

    return this.prisma.attendance.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteAttendance(id: string) {
    await this.findAttendanceById(id);
    await this.prisma.attendance.delete({
      where: { id },
    });
  }

  async checkIn(employeeId: string, dto: CheckInDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (attendance && attendance.checkIn) {
      throw new BadRequestException('Already checked in today');
    }

    const checkInTime = new Date();
    const workSchedule = await this.getWorkSchedule(employeeId);

    let lateMinutes = 0;
    if (workSchedule) {
      const [scheduleHour, scheduleMinute] = workSchedule.startTime.split(':').map(Number);
      const scheduleTime = new Date(today);
      scheduleTime.setHours(scheduleHour, scheduleMinute, 0, 0);

      if (checkInTime > scheduleTime) {
        lateMinutes = Math.floor((checkInTime.getTime() - scheduleTime.getTime()) / (1000 * 60));
      }
    }

    const data: Prisma.AttendanceCreateInput | Prisma.AttendanceUpdateInput = {
      checkIn: checkInTime,
      status: lateMinutes > 0 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
      lateMinutes: lateMinutes > 0 ? lateMinutes : undefined,
    };

    if (dto.location) {
      data.location = dto.location as Prisma.InputJsonValue;
    }

    if (dto.notes) {
      data.notes = dto.notes;
    }

    if (attendance) {
      return this.prisma.attendance.update({
        where: { id: attendance.id },
        data: data as Prisma.AttendanceUpdateInput,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } else {
      return this.prisma.attendance.create({
        data: {
          ...(data as Prisma.AttendanceCreateInput),
          employee: {
            connect: { id: employeeId },
          },
          date: today,
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }
  }

  async checkOut(employeeId: string, dto: CheckOutDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('No check-in found for today');
    }

    if (!attendance.checkIn) {
      throw new BadRequestException('Must check in before checking out');
    }

    if (attendance.checkOut) {
      throw new BadRequestException('Already checked out today');
    }

    const checkOutTime = new Date();
    const workHours = this.calculateWorkHours(attendance.checkIn, checkOutTime);
    const workSchedule = await this.getWorkSchedule(employeeId);

    let overtimeHours = 0;
    if (workSchedule) {
      const expectedHours = this.calculateExpectedHours(workSchedule);
      if (workHours > expectedHours) {
        overtimeHours = workHours - expectedHours;
      }
    }

    const updateData: Prisma.AttendanceUpdateInput = {
      checkOut: checkOutTime,
      workHours,
      overtimeHours: overtimeHours > 0 ? overtimeHours : undefined,
    };

    if (dto.location) {
      updateData.location = dto.location as Prisma.InputJsonValue;
    }

    if (dto.notes) {
      updateData.notes = dto.notes;
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getAttendanceSummary(employeeId: string, startDate: string, endDate: string) {
    const attendances = await this.findAllAttendances(employeeId, startDate, endDate);

    const summary = {
      totalDays: attendances.length,
      present: attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length,
      absent: attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length,
      late: attendances.filter((a) => a.status === AttendanceStatus.LATE).length,
      onLeave: attendances.filter((a) => a.status === AttendanceStatus.ON_LEAVE).length,
      totalWorkHours: attendances.reduce((sum, a) => sum + (a.workHours || 0), 0),
      totalOvertimeHours: attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0),
      averageWorkHours: 0,
    };

    const daysWithHours = attendances.filter((a) => a.workHours && a.workHours > 0).length;
    summary.averageWorkHours = daysWithHours > 0 ? summary.totalWorkHours / daysWithHours : 0;

    return summary;
  }

  async createWorkSchedule(dto: CreateWorkScheduleDto) {
    return this.prisma.workSchedule.create({
      data: {
        name: dto.name,
        startTime: dto.startTime,
        endTime: dto.endTime,
        breakDuration: dto.breakDuration,
        workDays: dto.workDays,
        isDefault: dto.isDefault ?? false,
        employeeId: dto.employeeId,
        departmentId: dto.departmentId,
        positionId: dto.positionId,
      },
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });
  }

  async findAllWorkSchedules() {
    return this.prisma.workSchedule.findMany({
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });
  }

  async findWorkScheduleById(id: string) {
    const schedule = await this.prisma.workSchedule.findUnique({
      where: { id },
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Work schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async updateWorkSchedule(id: string, dto: UpdateWorkScheduleDto) {
    await this.findWorkScheduleById(id);

    return this.prisma.workSchedule.update({
      where: { id },
      data: dto,
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });
  }

  async deleteWorkSchedule(id: string) {
    await this.findWorkScheduleById(id);
    await this.prisma.workSchedule.delete({
      where: { id },
    });
  }

  private async getWorkSchedule(employeeId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        workSchedule: true,
        position: {
          include: {
            department: true,
          },
        },
      },
    });

    if (employee?.workSchedule) {
      return employee.workSchedule;
    }

    if (employee?.position) {
      const positionSchedule = await this.prisma.workSchedule.findFirst({
        where: {
          positionId: employee.position.id,
          isDefault: true,
        },
      });

      if (positionSchedule) {
        return positionSchedule;
      }

      if (employee.position.department) {
        const departmentSchedule = await this.prisma.workSchedule.findFirst({
          where: {
            departmentId: employee.position.department.id,
            isDefault: true,
          },
        });

        if (departmentSchedule) {
          return departmentSchedule;
        }
      }
    }

    return await this.prisma.workSchedule.findFirst({
      where: {
        isDefault: true,
        employeeId: null,
        departmentId: null,
        positionId: null,
      },
    });
  }

  private calculateWorkHours(checkIn: Date, checkOut: Date): number {
    const diffMs = checkOut.getTime() - checkIn.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  private calculateExpectedHours(schedule: {
    startTime: string;
    endTime: string;
    breakDuration?: number | null;
  }): number {
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const breakMinutes = schedule.breakDuration || 0;

    return (endMinutes - startMinutes - breakMinutes) / 60;
  }
}
