import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreatePositionDto } from '@application/graphql/dto/create-position.dto';
import { UpdatePositionDto } from '@application/graphql/dto/update-position.dto';
import { Position } from '@application/graphql/types/position.type';

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Position[]> {
    const result = await this.prisma.position.findMany({
      include: {
        employees: true,
      },
    });

    return result.map((position) => ({
      id: position.id.toString(),
      title: position.title,
      description: position.description,
      level: position.level,
      employeeIds: position.employees.map((e) => e.id.toString()),
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    }));
  }

  async findById(id: string): Promise<Position> {
    const result = await this.prisma.position.findUnique({
      where: { id: parseInt(id) },
      include: {
        employees: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      title: result.title,
      description: result.description,
      level: result.level,
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Position[]> {
    const result = await this.prisma.position.findMany({
      where: {
        employees: {
          some: {
            id: parseInt(employeeId),
          },
        },
      },
      include: {
        employees: true,
      },
    });

    return result.map((position) => ({
      id: position.id.toString(),
      title: position.title,
      description: position.description,
      level: position.level,
      employeeIds: position.employees.map((e) => e.id.toString()),
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    }));
  }

  async create(data: CreatePositionDto): Promise<Position> {
    const result = await this.prisma.position.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        employees: {
          connect: data.employeeIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employees: true,
      },
    });

    return {
      id: result.id.toString(),
      title: result.title,
      description: result.description,
      level: result.level,
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdatePositionDto): Promise<Position> {
    const result = await this.prisma.position.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        employees: {
          set: data.employeeIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employees: true,
      },
    });

    return {
      id: result.id.toString(),
      title: result.title,
      description: result.description,
      level: result.level,
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.position.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
