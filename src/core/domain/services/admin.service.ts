import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from '@application/api/dto/admin.dto';
import { AdminRole, Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AdminModel[]> {
    const admins = await this.prisma.admin.findMany({
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });

    return admins.map((admin) => this.mapAdmin(admin));
  }

  async findOne(id: string): Promise<AdminModel> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return this.mapAdmin(admin);
  }

  async create(data: CreateAdminDto): Promise<AdminModel> {
    await this.ensureEmployeeExists(data.employeeId);

    const admin = await this.prisma.admin.create({
      data: {
        employeeId: data.employeeId,
        role: data.role,
        notes: data.notes,
      },
      include: this.defaultInclude,
    });

    return this.mapAdmin(admin);
  }

  async update(id: string, data: UpdateAdminDto): Promise<AdminModel> {
    await this.ensureAdminExists(id);

    const admin = await this.prisma.admin.update({
      where: { id },
      data: {
        employeeId: data.employeeId,
        role: data.role,
        notes: data.notes,
      },
      include: this.defaultInclude,
    });

    return this.mapAdmin(admin);
  }

  async remove(id: string): Promise<boolean> {
    await this.ensureAdminExists(id);
    await this.prisma.admin.delete({ where: { id } });
    return true;
  }

  private async ensureAdminExists(id: string): Promise<void> {
    const exists = await this.prisma.admin.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }

  private async ensureEmployeeExists(employeeId: string): Promise<void> {
    const exists = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
  }

  private mapAdmin(admin: AdminRecord): AdminModel {
    return {
      id: admin.id,
      role: admin.role,
      notes: admin.notes ?? undefined,
      employee: {
        id: admin.employeeId,
        name: admin.employee?.name ?? undefined,
        email: admin.employee?.email ?? undefined,
      },
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  private get defaultInclude() {
    return {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    } satisfies Prisma.AdminInclude;
  }
}

type AdminRecord = Prisma.AdminGetPayload<{
  include: {
    employee: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type AdminModel = {
  id: string;
  role: AdminRole;
  notes?: string;
  employee: {
    id: string;
    name?: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
