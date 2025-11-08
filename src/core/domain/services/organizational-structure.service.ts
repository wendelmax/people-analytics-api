import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class OrganizationalStructureService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<OrganizationOverviewModel[]> {
    const departments = await this.prisma.department.findMany({
      include: {
        positions: {
          include: {
            employees: {
              select: {
                id: true,
              },
            },
          },
          orderBy: { title: 'asc' },
        },
        employees: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return departments.map((department) => ({
      id: department.id,
      name: department.name,
      description: department.description ?? undefined,
      employeeCount: department.employees.length,
      positionCount: department.positions.length,
      positions: department.positions.map((position) => ({
        id: position.id,
        title: position.title,
        employeeCount: position.employees.length,
      })),
    }));
  }

  async getDepartmentEmployees(departmentId: string): Promise<DepartmentEmployeesModel> {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        employees: {
          include: {
            position: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    return {
      department: {
        id: department.id,
        name: department.name,
      },
      employees: department.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        position: employee.position
          ? { id: employee.position.id, title: employee.position.title }
          : undefined,
        email: employee.email,
      })),
    };
  }

  async getDepartmentPositions(departmentId: string): Promise<DepartmentPositionsModel> {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        positions: {
          include: {
            employees: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { title: 'asc' },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    return {
      department: {
        id: department.id,
        name: department.name,
      },
      positions: department.positions.map((position) => ({
        id: position.id,
        title: position.title,
        level: position.level ?? undefined,
        employeeCount: position.employees.length,
      })),
    };
  }
}

export type OrganizationOverviewModel = {
  id: string;
  name: string;
  description?: string;
  employeeCount: number;
  positionCount: number;
  positions: {
    id: string;
    title: string;
    employeeCount: number;
  }[];
};

export type DepartmentEmployeesModel = {
  department: {
    id: string;
    name: string;
  };
  employees: {
    id: string;
    name: string;
    email: string;
    position?: {
      id: string;
      title: string;
    };
  }[];
};

export type DepartmentPositionsModel = {
  department: {
    id: string;
    name: string;
  };
  positions: {
    id: string;
    title: string;
    level?: string;
    employeeCount: number;
  }[];
};
