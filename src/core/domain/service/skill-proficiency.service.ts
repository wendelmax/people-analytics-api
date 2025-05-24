import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/infrastructure/database/prisma/prisma.service';

@Injectable()
export class SkillProficiencyService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeeSkills(employeeId: number) {
    return this.prisma.skillsAssessment.findMany({
      where: { employeeId },
      include: {
        skill: true,
        evaluators: true,
      },
    });
  }

  async trackSkillProgress(employeeId: number, skillId: number, proficiencyLevel: number) {
    return this.prisma.skillsAssessment.create({
      data: {
        employeeId,
        skillId,
        proficiencyLevel,
        assessmentDate: new Date(),
      },
    });
  }

  async getSkillEvolutionHistory(employeeId: number, skillId: number) {
    return this.prisma.skillsAssessment.findMany({
      where: {
        employeeId,
        skillId,
      },
      orderBy: { assessmentDate: 'asc' },
    });
  }
}
