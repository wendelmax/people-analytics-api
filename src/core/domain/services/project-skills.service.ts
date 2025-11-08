import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { ProjectSkillDto } from '@application/api/dto/project-skill.dto';

@Injectable()
export class ProjectSkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByProject(projectId: string): Promise<ProjectSkillModel[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return project.requiredSkills.map((link) => ({
      projectId: project.id,
      skillId: link.skillId,
      skillName: link.skill.name,
    }));
  }

  async addSkill(data: ProjectSkillDto): Promise<ProjectSkillModel> {
    await this.ensureProjectExists(data.projectId);
    await this.ensureSkillExists(data.skillId);

    const link = await this.prisma.projectSkill.upsert({
      where: {
        projectId_skillId: {
          projectId: data.projectId,
          skillId: data.skillId,
        },
      },
      update: {},
      create: {
        projectId: data.projectId,
        skillId: data.skillId,
      },
      include: {
        skill: true,
      },
    });

    return {
      projectId: link.projectId,
      skillId: link.skillId,
      skillName: link.skill.name,
    };
  }

  async removeSkill(data: ProjectSkillDto): Promise<boolean> {
    await this.prisma.projectSkill.delete({
      where: {
        projectId_skillId: {
          projectId: data.projectId,
          skillId: data.skillId,
        },
      },
    });
    return true;
  }

  private async ensureProjectExists(projectId: string): Promise<void> {
    const exists = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
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

export type ProjectSkillModel = {
  projectId: string;
  skillId: string;
  skillName: string;
};
