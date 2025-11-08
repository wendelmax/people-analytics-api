import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateSkillDto, UpdateSkillDto } from '@application/api/dto/skill.dto';
import { SkillCategory, SkillLevel, SkillType } from '@prisma/client';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SkillModel[]> {
    const skills = await this.prisma.skill.findMany({
      include: {
        employeeLinks: true,
      },
      orderBy: { name: 'asc' },
    });

    return skills.map((skill) => this.mapToModel(skill));
  }

  async findById(id: string): Promise<SkillModel> {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: {
        employeeLinks: true,
      },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return this.mapToModel(skill);
  }

  async create(data: CreateSkillDto): Promise<SkillModel> {
    const skill = await this.prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        defaultLevel: data.defaultLevel ?? SkillLevel.BEGINNER,
      },
      include: {
        employeeLinks: true,
      },
    });

    return this.mapToModel(skill);
  }

  async update(id: string, data: UpdateSkillDto): Promise<SkillModel> {
    await this.ensureExists(id);

    const skill = await this.prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        defaultLevel: data.defaultLevel,
      },
      include: {
        employeeLinks: true,
      },
    });

    return this.mapToModel(skill);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.skill.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.skill.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
  }

  private mapToModel(skill: SkillWithRelations): SkillModel {
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description ?? undefined,
      type: skill.type,
      category: skill.category,
      defaultLevel: skill.defaultLevel,
      employeeIds: skill.employeeLinks.map((link) => link.employeeId),
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }
}

type SkillWithRelations = {
  id: string;
  name: string;
  description: string | null;
  type: SkillType;
  category: SkillCategory;
  defaultLevel: SkillLevel;
  createdAt: Date;
  updatedAt: Date;
  employeeLinks: { employeeId: string }[];
};

export type SkillModel = {
  id: string;
  name: string;
  description?: string;
  type: SkillType;
  category: SkillCategory;
  defaultLevel: SkillLevel;
  employeeIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
