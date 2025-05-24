import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateEmployeeInput } from '@application/graphql/inputs/create-employee.input';
import { UpdateEmployeeInput } from '@application/graphql/inputs/update-employee.input';
import { Employee } from '@application/graphql/types/employee.type';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Employee[]> {
    const result = await this.prisma.employee.findMany({
      include: {
        skills: true,
      },
    });

    return result.map((employee) => ({
      id: employee.id.toString(),
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate,
      status: employee.status,
      skillIds: employee.skills.map((s) => s.id.toString()),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));
  }

  async findById(id: string): Promise<Employee> {
    const result = await this.prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      name: result.name,
      email: result.email,
      position: result.position,
      department: result.department,
      hireDate: result.hireDate,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async create(data: CreateEmployeeInput): Promise<Employee> {
    const result = await this.prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        position: data.position,
        department: data.department,
        hireDate: data.hireDate,
        status: data.status,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      name: result.name,
      email: result.email,
      position: result.position,
      department: result.department,
      hireDate: result.hireDate,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateEmployeeInput): Promise<Employee> {
    const result = await this.prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        position: data.position,
        department: data.department,
        hireDate: data.hireDate,
        status: data.status,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      name: result.name,
      email: result.email,
      position: result.position,
      department: result.department,
      hireDate: result.hireDate,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.employee.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
