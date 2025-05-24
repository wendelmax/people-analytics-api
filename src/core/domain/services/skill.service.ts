import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateSkillDto } from '@application/graphql/dto/create-skill.dto';
import { UpdateSkillDto } from '@application/graphql/dto/update-skill.dto';
import { Skill } from '@application/graphql/types/skill.type';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Skill[]> {
    const result = await this.prisma.skill.findMany({
      include: {
        employees: true,
      },
    });

    return result.map((skill) => ({
      id: skill.id.toString(),
      name: skill.name,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      employeeIds: skill.employees.map((e) => e.id.toString()),
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }));
  }

  async findById(id: string): Promise<Skill> {
    const result = await this.prisma.skill.findUnique({
      where: { id: parseInt(id) },
      include: {
        employees: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      category: result.category,
      level: result.level,
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Skill[]> {
    const result = await this.prisma.skill.findMany({
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

    return result.map((skill) => ({
      id: skill.id.toString(),
      name: skill.name,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      employeeIds: skill.employees.map((e) => e.id.toString()),
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }));
  }

  async create(data: CreateSkillDto): Promise<Skill> {
    const result = await this.prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
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
      name: result.name,
      description: result.description,
      category: result.category,
      level: result.level,
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateSkillDto): Promise<Skill> {
    const result = await this.prisma.skill.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
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
      name: result.name,
      description: result.description,
      category: result.category,
      level: result.level,
      employeeIds: result.employees.map((e) => e.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.skill.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
