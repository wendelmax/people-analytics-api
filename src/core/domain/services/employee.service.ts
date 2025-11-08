import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '@application/api/dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<EmployeeModel[]> {
    const result = await this.prisma.employee.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        department: true,
        position: true,
      },
    });

    return result.map((employee) => this.mapToModel(employee));
  }

  async findById(id: string): Promise<EmployeeModel> {
    const result = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        department: true,
        position: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return this.mapToModel(result);
  }

  async create(data: CreateEmployeeDto): Promise<EmployeeModel> {
    const result = await this.prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        hireDate: new Date(data.hireDate),
        department: {
          connect: { id: data.departmentId },
        },
        position: {
          connect: { id: data.positionId },
        },
        skills: data.skillIds?.length
          ? {
              createMany: {
                data: data.skillIds.map((id) => ({ skillId: id })),
                skipDuplicates: true,
              },
            }
          : undefined,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        department: true,
        position: true,
      },
    });

    return this.mapToModel(result);
  }

  async update(id: string, data: UpdateEmployeeDto): Promise<EmployeeModel> {
    const result = await this.prisma.employee.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
        department: data.departmentId
          ? {
              connect: { id: data.departmentId },
            }
          : undefined,
        position: data.positionId
          ? {
              connect: { id: data.positionId },
            }
          : undefined,
        skills: data.skillIds
          ? {
              deleteMany: {},
              createMany: {
                data: data.skillIds.map((skillId) => ({ skillId })),
                skipDuplicates: true,
              },
            }
          : undefined,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        department: true,
        position: true,
      },
    });

    return this.mapToModel(result);
  }

  async delete(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.employee.delete({
      where: { id },
    });
    return true;
  }

  private mapToModel(employee: EmployeeWithRelations): EmployeeModel {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      hireDate: employee.hireDate,
      departmentId: employee.departmentId,
      departmentName: employee.department?.name ?? null,
      positionId: employee.positionId,
      positionTitle: employee.position?.title ?? null,
      skillIds: employee.skills.map((employeeSkill) => employeeSkill.skillId),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }
}

type EmployeeWithRelations = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  hireDate: Date;
  departmentId: string;
  department: { id: string; name: string } | null;
  positionId: string;
  position: { id: string; title: string } | null;
  skills: { skillId: string; skill: { id: string } }[];
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeModel = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  hireDate: Date;
  departmentId: string;
  departmentName: string | null;
  positionId: string;
  positionTitle: string | null;
  skillIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
