import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateEmployeeJourneyInput } from '@application/graphql/inputs/create-employee-journey.input';
import { UpdateEmployeeJourneyInput } from '@application/graphql/inputs/update-employee-journey.input';
import { EmployeeJourney } from '@application/graphql/types/employee-journey.type';

@Injectable()
export class EmployeeJourneyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<EmployeeJourney[]> {
    const result = await this.prisma.employeeJourney.findMany({
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });

    return result.map((journey) => ({
      id: journey.id.toString(),
      employeeId: journey.employeeId.toString(),
      type: journey.type,
      description: journey.description,
      startDate: journey.startDate,
      endDate: journey.endDate,
      status: journey.status,
      departmentId: journey.departmentId?.toString(),
      positionId: journey.positionId?.toString(),
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
    }));
  }

  async findById(id: string): Promise<EmployeeJourney> {
    const result = await this.prisma.employeeJourney.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Employee journey with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      departmentId: result.departmentId?.toString(),
      positionId: result.positionId?.toString(),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeeJourney[]> {
    const result = await this.prisma.employeeJourney.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        position: true,
        department: true,
      },
    });

    return result.map((journey) => ({
      id: journey.id.toString(),
      employeeId: journey.employeeId.toString(),
      positionId: journey.positionId?.toString(),
      departmentId: journey.departmentId?.toString(),
      startDate: journey.startDate,
      endDate: journey.endDate,
      status: journey.status,
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
    }));
  }

  async create(data: CreateEmployeeJourneyInput): Promise<EmployeeJourney> {
    const result = await this.prisma.employeeJourney.create({
      data: {
        employeeId: parseInt(data.employeeId),
        type: data.type,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        departmentId: data.departmentId ? parseInt(data.departmentId) : null,
        positionId: data.positionId ? parseInt(data.positionId) : null,
      },
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      departmentId: result.departmentId?.toString(),
      positionId: result.positionId?.toString(),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateEmployeeJourneyInput): Promise<EmployeeJourney> {
    const result = await this.prisma.employeeJourney.update({
      where: { id: parseInt(id) },
      data: {
        type: data.type,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        departmentId: data.departmentId ? parseInt(data.departmentId) : undefined,
        positionId: data.positionId ? parseInt(data.positionId) : undefined,
      },
      include: {
        employee: true,
        department: true,
        position: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      type: result.type,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      departmentId: result.departmentId?.toString(),
      positionId: result.positionId?.toString(),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.employeeJourney.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
