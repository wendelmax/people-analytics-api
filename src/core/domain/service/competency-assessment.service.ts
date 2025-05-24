import { Injectable } from '@nestjs/common';
import { AssessmentStatus } from '@prisma/client';
import { PrismaService } from '@core/infrastructure/database/prisma/prisma.service';
import { CreateCompetencyAssessmentDto } from '@shared/dto/base.dto';

@Injectable()
export class CompetencyAssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssessmentPeriod(name: string, startDate: Date, endDate: Date) {
    return this.prisma.assessmentPeriod.create({
      data: {
        name,
        startDate,
        endDate,
        status: 'UPCOMING',
      },
    });
  }

  async createCompetencyAssessment(createDto: CreateCompetencyAssessmentDto) {
    return this.prisma.competencyAssessment.create({
      data: {
        employeeId: createDto.employeeId,
        assessorId: createDto.assessorId,
        competencyId: createDto.competencyId,
        rating: createDto.rating,
        feedback: createDto.feedback,
        assessmentPeriodId: createDto.assessmentPeriodId,
      },
    });
  }

  async findAllAssessmentPeriods() {
    return this.prisma.assessmentPeriod.findMany({
      include: {
        competencyAssessments: {
          include: {
            employee: true,
            assessor: true,
            competency: true,
          },
        },
      },
    });
  }

  async findCompetencyAssessmentsByEmployee(employeeId: number) {
    return this.prisma.competencyAssessment.findMany({
      where: { employeeId },
      include: {
        assessor: true,
        competency: true,
        assessmentPeriod: true,
      },
    });
  }

  async updateAssessmentPeriodStatus(periodId: number, status: AssessmentStatus) {
    return this.prisma.assessmentPeriod.update({
      where: { id: periodId },
      data: { status },
    });
  }

  async calculateEmployeeCompetencyScore(employeeId: number) {
    const assessments = await this.prisma.competencyAssessment.findMany({
      where: { employeeId },
      select: { rating: true },
    });

    const totalRating = assessments.reduce((sum, assessment) => sum + assessment.rating, 0);
    const averageRating = totalRating / assessments.length;

    return {
      employeeId,
      totalAssessments: assessments.length,
      averageCompetencyScore: averageRating,
    };
  }
}
