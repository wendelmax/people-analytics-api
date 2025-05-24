import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class CareerRoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoadmapPaths() {
    return this.prisma.careerPath.findMany({
      include: {
        requiredSkills: true,
        nextPossiblePaths: true,
        prerequisites: true,
      },
    });
  }

  async getEmployeeRoadmap(employeeId: number) {
    return this.prisma.employeeCareerProgress.findMany({
      where: { employeeId },
      include: {
        currentPath: {
          include: {
            requiredSkills: true,
            nextPossiblePaths: true,
          },
        },
        completedPaths: true,
        targetPath: true,
      },
    });
  }

  async setCareerGoal(employeeId: number, targetPathId: number) {
    return this.prisma.employeeCareerProgress.update({
      where: { employeeId },
      data: {
        targetPathId,
        goalSetDate: new Date(),
      },
    });
  }

  async suggestNextSteps() {
    return this.analyzeNextSteps();
  }

  private async analyzeNextSteps() {
    // Implementar lógica de análise e recomendação
    // Retorna caminhos recomendados com base em:
    // - Habilidades atuais vs. requeridas
    // - Histórico de progressão
    // - Objetivos definidos
    return {
      recommendedPaths: [],
      skillGaps: [],
      estimatedTimeToComplete: null,
    };
  }
}
