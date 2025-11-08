import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from '@application/api/dto/feedback.dto';
import { FeedbackType, SentimentType, Prisma } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FeedbackModel[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      include: {
        author: true,
        recipient: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return feedbacks.map((feedback) => this.mapToModel(feedback));
  }

  async findById(id: string): Promise<FeedbackModel> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        author: true,
        recipient: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return this.mapToModel(feedback);
  }

  async findByRecipientId(recipientId: string): Promise<FeedbackModel[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: { recipientId },
      include: {
        author: true,
        recipient: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return feedbacks.map((feedback) => this.mapToModel(feedback));
  }

  async findByAuthorId(authorId: string): Promise<FeedbackModel[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: { authorId },
      include: {
        author: true,
        recipient: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return feedbacks.map((feedback) => this.mapToModel(feedback));
  }

  async create(data: CreateFeedbackDto): Promise<FeedbackModel> {
    const feedback = await this.prisma.feedback.create({
      data: {
        authorId: data.authorId,
        recipientId: data.recipientId,
        type: data.type,
        sentiment: data.sentiment,
        title: data.title,
        content: data.content,
        rating: data.rating,
        tags: data.tags ?? [],
      },
      include: {
        author: true,
        recipient: true,
      },
    });

    return this.mapToModel(feedback);
  }

  async update(id: string, data: UpdateFeedbackDto): Promise<FeedbackModel> {
    await this.ensureExists(id);

    const feedback = await this.prisma.feedback.update({
      where: { id },
      data: {
        type: data.type,
        sentiment: data.sentiment,
        title: data.title,
        content: data.content,
        rating: data.rating,
        tags: data.tags,
      },
      include: {
        author: true,
        recipient: true,
      },
    });

    return this.mapToModel(feedback);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.feedback.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.feedback.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
  }

  private mapToModel(feedback: FeedbackWithRelations): FeedbackModel {
    return {
      id: feedback.id,
      authorId: feedback.authorId,
      recipientId: feedback.recipientId,
      type: feedback.type,
      sentiment: feedback.sentiment,
      title: feedback.title,
      content: feedback.content,
      rating: feedback.rating ?? undefined,
      tags: feedback.tags,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }
}

type FeedbackWithRelations = Prisma.FeedbackGetPayload<{
  include: {
    author: true;
    recipient: true;
  };
}>;

export type FeedbackModel = {
  id: string;
  authorId: string;
  recipientId: string;
  type: FeedbackType;
  sentiment: SentimentType;
  title: string;
  content: string;
  rating?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
