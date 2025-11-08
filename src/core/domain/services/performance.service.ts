import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreatePerformanceReviewDto,
  UpdatePerformanceReviewDto,
} from '@application/api/dto/performance-review.dto';
import { PerformanceReviewStatus, Prisma } from '@prisma/client';

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PerformanceReviewModel[]> {
    const reviews = await this.prisma.performanceReview.findMany({
      include: {
        employee: true,
        reviewer: true,
      },
      orderBy: { periodStart: 'desc' },
    });

    return reviews.map((review) => this.mapToModel(review));
  }

  async findById(id: string): Promise<PerformanceReviewModel> {
    const review = await this.prisma.performanceReview.findUnique({
      where: { id },
      include: {
        employee: true,
        reviewer: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Performance review with ID ${id} not found`);
    }

    return this.mapToModel(review);
  }

  async findByEmployeeId(employeeId: string): Promise<PerformanceReviewModel[]> {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { employeeId },
      include: {
        employee: true,
        reviewer: true,
      },
      orderBy: { periodStart: 'desc' },
    });

    return reviews.map((review) => this.mapToModel(review));
  }

  async findByReviewerId(reviewerId: string): Promise<PerformanceReviewModel[]> {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { reviewerId },
      include: {
        employee: true,
        reviewer: true,
      },
      orderBy: { periodStart: 'desc' },
    });

    return reviews.map((review) => this.mapToModel(review));
  }

  async create(data: CreatePerformanceReviewDto): Promise<PerformanceReviewModel> {
    const review = await this.prisma.performanceReview.create({
      data: {
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        status: data.status,
        overallRating: data.overallRating,
        strengths: data.strengths ?? [],
        improvements: data.improvements ?? [],
        comments: data.comments,
      },
      include: {
        employee: true,
        reviewer: true,
      },
    });

    return this.mapToModel(review);
  }

  async update(id: string, data: UpdatePerformanceReviewDto): Promise<PerformanceReviewModel> {
    await this.ensureExists(id);

    const review = await this.prisma.performanceReview.update({
      where: { id },
      data: {
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        periodStart: data.periodStart ? new Date(data.periodStart) : undefined,
        periodEnd: data.periodEnd ? new Date(data.periodEnd) : undefined,
        status: data.status,
        overallRating: data.overallRating,
        strengths: data.strengths,
        improvements: data.improvements,
        comments: data.comments,
      },
      include: {
        employee: true,
        reviewer: true,
      },
    });

    return this.mapToModel(review);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.performanceReview.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.performanceReview.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Performance review with ID ${id} not found`);
    }
  }

  private mapToModel(review: PerformanceReviewWithRelations): PerformanceReviewModel {
    return {
      id: review.id,
      employeeId: review.employeeId,
      reviewerId: review.reviewerId,
      periodStart: review.periodStart,
      periodEnd: review.periodEnd,
      status: review.status,
      overallRating: review.overallRating ?? undefined,
      strengths: review.strengths,
      improvements: review.improvements,
      comments: review.comments ?? undefined,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}

type PerformanceReviewWithRelations = Prisma.PerformanceReviewGetPayload<{
  include: {
    employee: true;
    reviewer: true;
  };
}>;

export type PerformanceReviewModel = {
  id: string;
  employeeId: string;
  reviewerId: string;
  periodStart: Date;
  periodEnd: Date;
  status: PerformanceReviewStatus;
  overallRating?: number;
  strengths: string[];
  improvements: string[];
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
};
