import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { TrackSkillProgressDto } from '@application/api/dto/skill-proficiency.dto';

@Injectable()
export class SkillProficiencyService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeeSkills(employeeId: string): Promise<EmployeeSkillProficiencyModel[]> {
    await this.ensureEmployeeExists(employeeId);

    const [skills, history] = await Promise.all([
      this.prisma.employeeSkill.findMany({
        where: { employeeId },
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
            },
          },
        },
        orderBy: {
          skill: {
            name: 'asc',
          },
        },
      }),
      this.prisma.skillProgressEntry.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return skills.map((link) => ({
      skillId: link.skillId,
      skillName: link.skill.name,
      type: link.skill.type,
      category: link.skill.category,
      proficiency: link.proficiency,
      lastEvaluated: link.lastEvaluated ?? undefined,
      history: history
        .filter((entry) => entry.skillId === link.skillId)
        .map((entry) => ({
          id: entry.id,
          proficiency: entry.proficiency,
          evidence: entry.evidence ?? undefined,
          createdAt: entry.createdAt,
        })),
    }));
  }

  async trackSkillProgress(
    employeeId: string,
    skillId: string,
    data: TrackSkillProgressDto,
  ): Promise<SkillProgressEntryModel[]> {
    await this.ensureEmployeeExists(employeeId);
    await this.ensureSkillExists(skillId);

    await this.prisma.employeeSkill.upsert({
      where: {
        employeeId_skillId: {
          employeeId,
          skillId,
        },
      },
      update: {
        proficiency: data.proficiencyLevel,
        lastEvaluated: new Date(),
      },
      create: {
        employeeId,
        skillId,
        proficiency: data.proficiencyLevel,
        lastEvaluated: new Date(),
      },
    });

    await this.prisma.skillProgressEntry.create({
      data: {
        employeeId,
        skillId,
        proficiency: data.proficiencyLevel,
        evidence: data.evidence,
      },
    });

    return this.getSkillEvolutionHistory(employeeId, skillId);
  }

  async getSkillEvolutionHistory(
    employeeId: string,
    skillId: string,
  ): Promise<SkillProgressEntryModel[]> {
    await this.ensureEmployeeExists(employeeId);
    await this.ensureSkillExists(skillId);

    const history = await this.prisma.skillProgressEntry.findMany({
      where: {
        employeeId,
        skillId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return history.map((entry) => ({
      id: entry.id,
      proficiency: entry.proficiency,
      evidence: entry.evidence ?? undefined,
      createdAt: entry.createdAt,
    }));
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

  private async ensureSkillExists(skillId: string): Promise<void> {
    const exists = await this.prisma.skill.findUnique({
      where: { id: skillId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Skill with ID ${skillId} not found`);
    }
  }
}

export type EmployeeSkillProficiencyModel = {
  skillId: string;
  skillName: string;
  type: string;
  category: string;
  proficiency: string;
  lastEvaluated?: Date;
  history: SkillProgressEntryModel[];
};

export type SkillProgressEntryModel = {
  id: string;
  proficiency: string;
  evidence?: string;
  createdAt: Date;
};
