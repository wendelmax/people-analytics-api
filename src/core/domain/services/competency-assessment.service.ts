import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateCompetencyAssessmentDto } from '@application/graphql/dto/create-competency-assessment.dto';
import { UpdateCompetencyAssessmentDto } from '@application/graphql/dto/update-competency-assessment.dto';
import { CompetencyAssessment } from '@application/graphql/types/competency-assessment.type';

@Injectable()
export class CompetencyAssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CompetencyAssessment[]> {
    const result = await this.prisma.competencyAssessment.findMany({
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((assessment) => ({
      id: assessment.id.toString(),
      employeeId: assessment.employeeId.toString(),
      title: assessment.title,
      description: assessment.description,
      date: assessment.date,
      status: assessment.status,
      skillIds: assessment.skills.map((s) => s.id.toString()),
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
    }));
  }

  async findById(id: string): Promise<CompetencyAssessment> {
    const result = await this.prisma.competencyAssessment.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Competency assessment with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      date: result.date,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<CompetencyAssessment[]> {
    const assessments = await this.prisma.competencyAssessment.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return assessments.map((assessment) => ({
      id: assessment.id.toString(),
      employeeId: assessment.employeeId.toString(),
      title: assessment.title,
      description: assessment.description,
      date: assessment.date,
      status: assessment.status,
      skillIds: assessment.skills.map((s) => s.id.toString()),
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
    }));
  }

  async create(data: CreateCompetencyAssessmentDto): Promise<CompetencyAssessment> {
    const result = await this.prisma.competencyAssessment.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        description: data.description,
        date: data.date,
        status: data.status,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      date: result.date,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateCompetencyAssessmentDto): Promise<CompetencyAssessment> {
    const result = await this.prisma.competencyAssessment.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        status: data.status,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      description: result.description,
      date: result.date,
      status: result.status,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.competencyAssessment.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }

  async calculateEmployeeCompetencyScore(employeeId: number) {
    const result = await this.prisma.competencyAssessment.findMany({
      where: { employeeId },
      select: { rating: true },
    });

    const totalRating = result.reduce((sum, assessment) => sum + assessment.rating, 0);
    const averageRating = totalRating / result.length;

    return {
      employeeId,
      totalAssessments: result.length,
      averageCompetencyScore: averageRating,
    };
  }
}
