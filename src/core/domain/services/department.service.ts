import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateDepartmentInput } from '@application/graphql/inputs/create-department.input';
import { UpdateDepartmentInput } from '@application/graphql/inputs/update-department.input';
import { Department } from '@application/graphql/types/department.type';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Department[]> {
    const result = await this.prisma.department.findMany({
      include: {
        employees: true,
      },
    });

    return result.map((department) => ({
      id: department.id.toString(),
      name: department.name,
      description: department.description,
      employeeIds: department.employees.map((e) => e.id.toString()),
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    }));
  }

  async findById(id: string): Promise<Department> {
    const result = await this.prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: {
        manager: true,
        parent: true,
        children: true,
        employees: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      managerId: result.managerId.toString(),
      parentId: result.parentId?.toString(),
      childIds: result.children.map((c) => c.id.toString()),
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async create(data: CreateDepartmentInput): Promise<Department> {
    const result = await this.prisma.department.create({
      data: {
        name: data.name,
        description: data.description,
        managerId: parseInt(data.managerId),
        parentId: data.parentId ? parseInt(data.parentId) : null,
      },
      include: {
        manager: true,
        parent: true,
        children: true,
        employees: true,
      },
    });

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      managerId: result.managerId.toString(),
      parentId: result.parentId?.toString(),
      childIds: result.children.map((c) => c.id.toString()),
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateDepartmentInput): Promise<Department> {
    const result = await this.prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        managerId: data.managerId ? parseInt(data.managerId) : undefined,
        parentId: data.parentId ? parseInt(data.parentId) : undefined,
      },
      include: {
        manager: true,
        parent: true,
        children: true,
        employees: true,
      },
    });

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      managerId: result.managerId.toString(),
      parentId: result.parentId?.toString(),
      childIds: result.children.map((c) => c.id.toString()),
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.department.delete({
      where: { id },
    });
    return { success: true };
  }
}
