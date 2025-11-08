import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreatePositionDto, UpdatePositionDto } from '@application/api/dto/position.dto';

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PositionModel[]> {
    const positions = await this.prisma.position.findMany({
      include: {
        department: true,
        employees: true,
      },
      orderBy: { title: 'asc' },
    });

    return positions.map((position) => this.mapToModel(position));
  }

  async findById(id: string): Promise<PositionModel> {
    const position = await this.prisma.position.findUnique({
      where: { id },
      include: {
        department: true,
        employees: true,
      },
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return this.mapToModel(position);
  }

  async create(data: CreatePositionDto): Promise<PositionModel> {
    const position = await this.prisma.position.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        department: data.departmentId ? { connect: { id: data.departmentId } } : undefined,
      },
      include: {
        department: true,
        employees: true,
      },
    });

    return this.mapToModel(position);
  }

  async update(id: string, data: UpdatePositionDto): Promise<PositionModel> {
    await this.ensureExists(id);

    const position = await this.prisma.position.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        department: data.departmentId ? { connect: { id: data.departmentId } } : undefined,
      },
      include: {
        department: true,
        employees: true,
      },
    });

    return this.mapToModel(position);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.position.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.position.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
  }

  private mapToModel(position: PositionWithRelations): PositionModel {
    return {
      id: position.id,
      title: position.title,
      description: position.description ?? undefined,
      level: position.level ?? undefined,
      departmentId: position.department?.id,
      employeeIds: position.employees.map((employee) => employee.id),
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    };
  }
}

type PositionWithRelations = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  department?: { id: string } | null;
  employees: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
};

export type PositionModel = {
  id: string;
  title: string;
  description?: string;
  level?: string;
  departmentId?: string | null;
  employeeIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
