import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from '@application/api/dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DepartmentModel[]> {
    const departments = await this.prisma.department.findMany({
      include: {
        positions: true,
        employees: true,
      },
      orderBy: { name: 'asc' },
    });

    return departments.map((department) => this.mapToModel(department));
  }

  async findById(id: string): Promise<DepartmentModel> {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        positions: true,
        employees: true,
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return this.mapToModel(department);
  }

  async create(data: CreateDepartmentDto): Promise<DepartmentModel> {
    const department = await this.prisma.department.create({
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        positions: true,
        employees: true,
      },
    });

    return this.mapToModel(department);
  }

  async update(id: string, data: UpdateDepartmentDto): Promise<DepartmentModel> {
    await this.ensureExists(id);

    const department = await this.prisma.department.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        positions: true,
        employees: true,
      },
    });

    return this.mapToModel(department);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.department.delete({
      where: { id },
    });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.department.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
  }

  private mapToModel(department: DepartmentWithRelations): DepartmentModel {
    return {
      id: department.id,
      name: department.name,
      description: department.description ?? undefined,
      positionIds: department.positions.map((position) => position.id),
      employeeIds: department.employees.map((employee) => employee.id),
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}

type DepartmentWithRelations = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  positions: { id: string }[];
  employees: { id: string }[];
};

export type DepartmentModel = {
  id: string;
  name: string;
  description?: string;
  positionIds: string[];
  employeeIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
