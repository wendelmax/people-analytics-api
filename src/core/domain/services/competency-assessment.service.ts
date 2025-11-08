import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateAssessmentPeriodDto,
  CreateCompetencyAssessmentDto,
  UpdateAssessmentPeriodDto,
  UpdateAssessmentPeriodStatusDto,
  UpdateCompetencyAssessmentDto,
} from '@application/api/dto/competency-assessment.dto';
import { AssessmentPeriodStatus, CompetencyAssessmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class CompetencyAssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssessmentPeriod(data: CreateAssessmentPeriodDto): Promise<AssessmentPeriodModel> {
    const period = await this.prisma.assessmentPeriod.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status ?? AssessmentPeriodStatus.DRAFT,
      },
      include: {
        assessments: {
          select: { id: true },
        },
      },
    });

    return this.mapPeriod(period);
  }

  async updateAssessmentPeriod(
    id: string,
    data: UpdateAssessmentPeriodDto,
  ): Promise<AssessmentPeriodModel> {
    await this.ensurePeriodExists(id);

    const period = await this.prisma.assessmentPeriod.update({
      where: { id },
      data: {
        name: data.name,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
      },
      include: {
        assessments: {
          select: { id: true },
        },
      },
    });

    return this.mapPeriod(period);
  }

  async updateAssessmentPeriodStatus(
    id: string,
    data: UpdateAssessmentPeriodStatusDto,
  ): Promise<AssessmentPeriodModel> {
    const period = await this.prisma.assessmentPeriod.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        assessments: {
          select: { id: true },
        },
      },
    });

    return this.mapPeriod(period);
  }

  async findAllAssessmentPeriods(): Promise<AssessmentPeriodModel[]> {
    const periods = await this.prisma.assessmentPeriod.findMany({
      include: {
        assessments: {
          select: { id: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return periods.map((period) => this.mapPeriod(period));
  }

  async create(data: CreateCompetencyAssessmentDto): Promise<CompetencyAssessmentModel> {
    const assessment = await this.prisma.competencyAssessment.create({
      data: {
        periodId: data.periodId,
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        status: data.status,
        overallScore: data.overallScore,
        comments: data.comments,
        skillRatings: data.skillRatings?.length
          ? {
              create: data.skillRatings.map((rating) => ({
                skillId: rating.skillId,
                rating: rating.rating,
                comments: rating.comments,
              })),
            }
          : undefined,
      },
      include: this.defaultInclude,
    });

    return this.mapAssessment(assessment);
  }

  async findAll(): Promise<CompetencyAssessmentModel[]> {
    const assessments = await this.prisma.competencyAssessment.findMany({
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });

    return assessments.map((assessment) => this.mapAssessment(assessment));
  }

  async findOne(id: string): Promise<CompetencyAssessmentModel> {
    const assessment = await this.prisma.competencyAssessment.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!assessment) {
      throw new NotFoundException(`Competency assessment with ID ${id} not found`);
    }

    return this.mapAssessment(assessment);
  }

  async findCompetencyAssessmentsByEmployee(
    employeeId: string,
  ): Promise<CompetencyAssessmentModel[]> {
    const assessments = await this.prisma.competencyAssessment.findMany({
      where: { employeeId },
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });

    return assessments.map((assessment) => this.mapAssessment(assessment));
  }

  async update(
    id: string,
    data: UpdateCompetencyAssessmentDto,
  ): Promise<CompetencyAssessmentModel> {
    await this.ensureAssessmentExists(id);

    const assessment = await this.prisma.competencyAssessment.update({
      where: { id },
      data: {
        periodId: data.periodId,
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        status: data.status,
        overallScore: data.overallScore,
        comments: data.comments,
        skillRatings: data.skillRatings
          ? {
              deleteMany: {},
              create: data.skillRatings.map((rating) => ({
                skillId: rating.skillId,
                rating: rating.rating,
                comments: rating.comments,
              })),
            }
          : undefined,
      },
      include: this.defaultInclude,
    });

    return this.mapAssessment(assessment);
  }

  async remove(id: string): Promise<boolean> {
    await this.ensureAssessmentExists(id);
    await this.prisma.competencyAssessment.delete({ where: { id } });
    return true;
  }

  async calculateEmployeeCompetencyScore(
    employeeId: string,
  ): Promise<EmployeeCompetencyScoreModel> {
    const assessments = await this.prisma.competencyAssessment.findMany({
      where: {
        employeeId,
        status: CompetencyAssessmentStatus.COMPLETED,
      },
      select: {
        overallScore: true,
        skillRatings: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!assessments.length) {
      return {
        employeeId,
        totalAssessments: 0,
        averageScore: null,
      };
    }

    const scores: number[] = [];

    for (const assessment of assessments) {
      if (assessment.overallScore !== null && assessment.overallScore !== undefined) {
        scores.push(assessment.overallScore);
      } else if (assessment.skillRatings.length) {
        const averageSkillScore =
          assessment.skillRatings.reduce((sum, rating) => sum + rating.rating, 0) /
          assessment.skillRatings.length;
        scores.push(averageSkillScore);
      }
    }

    const total = scores.reduce((sum, value) => sum + value, 0);
    const average = scores.length ? total / scores.length : null;

    return {
      employeeId,
      totalAssessments: assessments.length,
      averageScore: average,
    };
  }

  private async ensurePeriodExists(id: string): Promise<void> {
    const exists = await this.prisma.assessmentPeriod.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Assessment period with ID ${id} not found`);
    }
  }

  private async ensureAssessmentExists(id: string): Promise<void> {
    const exists = await this.prisma.competencyAssessment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Competency assessment with ID ${id} not found`);
    }
  }

  private mapPeriod(period: AssessmentPeriodRecord): AssessmentPeriodModel {
    return {
      id: period.id,
      name: period.name,
      status: period.status,
      startDate: period.startDate,
      endDate: period.endDate,
      assessmentCount: period.assessments.length,
      createdAt: period.createdAt,
      updatedAt: period.updatedAt,
    };
  }

  private mapAssessment(assessment: CompetencyAssessmentRecord): CompetencyAssessmentModel {
    return {
      id: assessment.id,
      status: assessment.status,
      overallScore: assessment.overallScore ?? undefined,
      comments: assessment.comments ?? undefined,
      employee: {
        id: assessment.employeeId,
        name: assessment.employee.name,
        email: assessment.employee.email,
      },
      reviewer: assessment.reviewer
        ? {
            id: assessment.reviewer.id,
            name: assessment.reviewer.name,
            email: assessment.reviewer.email,
          }
        : undefined,
      period: {
        id: assessment.periodId,
        name: assessment.period.name,
        status: assessment.period.status,
        startDate: assessment.period.startDate,
        endDate: assessment.period.endDate,
      },
      skillRatings: assessment.skillRatings.map((rating) => ({
        id: rating.id,
        skillId: rating.skillId,
        rating: rating.rating,
        comments: rating.comments ?? undefined,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
      })),
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
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
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      period: {
        select: {
          id: true,
          name: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      },
      skillRatings: true,
    } satisfies Prisma.CompetencyAssessmentInclude;
  }
}

type AssessmentPeriodRecord = Prisma.AssessmentPeriodGetPayload<{
  include: {
    assessments: {
      select: {
        id: true;
      };
    };
  };
}>;

type CompetencyAssessmentRecord = Prisma.CompetencyAssessmentGetPayload<{
  include: {
    employee: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    reviewer: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    } | null;
    period: {
      select: {
        id: true;
        name: true;
        status: true;
        startDate: true;
        endDate: true;
      };
    };
    skillRatings: true;
  };
}>;

export type AssessmentPeriodModel = {
  id: string;
  name: string;
  status: AssessmentPeriodStatus;
  startDate: Date;
  endDate: Date;
  assessmentCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CompetencyAssessmentModel = {
  id: string;
  status: CompetencyAssessmentStatus;
  overallScore?: number;
  comments?: string;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
  period: {
    id: string;
    name: string;
    status: AssessmentPeriodStatus;
    startDate: Date;
    endDate: Date;
  };
  skillRatings: {
    id: string;
    skillId: string;
    rating: number;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeCompetencyScoreModel = {
  employeeId: string;
  totalAssessments: number;
  averageScore: number | null;
};
