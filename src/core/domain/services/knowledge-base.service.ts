import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateKnowledgeArticleDto,
  UpdateKnowledgeArticleDto,
  KnowledgeArticleQueryDto,
} from '@application/api/dto/knowledge-base.dto';
import { KnowledgeCategory, Prisma } from '@prisma/client';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: KnowledgeArticleQueryDto = {}): Promise<KnowledgeArticleModel[]> {
    const where = this.buildFilters(filters);

    const articles = await this.prisma.knowledgeArticle.findMany({
      where,
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) => this.mapArticle(article));
  }

  async findById(id: string): Promise<KnowledgeArticleModel> {
    const article = await this.prisma.knowledgeArticle.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!article) {
      throw new NotFoundException(`Knowledge article with ID ${id} not found`);
    }

    return this.mapArticle(article);
  }

  async findByAuthor(authorId: string): Promise<KnowledgeArticleModel[]> {
    const articles = await this.prisma.knowledgeArticle.findMany({
      where: { authorId },
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) => this.mapArticle(article));
  }

  async create(data: CreateKnowledgeArticleDto): Promise<KnowledgeArticleModel> {
    const article = await this.prisma.knowledgeArticle.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        authorId: data.authorId,
        departmentId: data.departmentId,
        tags: data.tags ?? [],
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        skillLinks: data.skillIds?.length
          ? {
              createMany: {
                data: data.skillIds.map((skillId) => ({ skillId })),
              },
            }
          : undefined,
      },
      include: this.defaultInclude,
    });

    return this.mapArticle(article);
  }

  async update(id: string, data: UpdateKnowledgeArticleDto): Promise<KnowledgeArticleModel> {
    await this.ensureExists(id);

    const article = await this.prisma.knowledgeArticle.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        authorId: data.authorId,
        departmentId: data.departmentId,
        tags: data.tags,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        skillLinks: data.skillIds
          ? {
              deleteMany: {},
              createMany: {
                data: data.skillIds.map((skillId) => ({ skillId })),
              },
            }
          : undefined,
      },
      include: this.defaultInclude,
    });

    return this.mapArticle(article);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.knowledgeArticle.delete({ where: { id } });
    return true;
  }

  async searchArticles(searchTerm: string): Promise<KnowledgeArticleModel[]> {
    if (!searchTerm) {
      return this.findAll();
    }

    return this.findAll({ searchTerm });
  }

  private buildFilters(filters: KnowledgeArticleQueryDto): Prisma.KnowledgeArticleWhereInput {
    const where: Prisma.KnowledgeArticleWhereInput = {};

    if (filters.category) {
      where.category = filters.category as KnowledgeCategory;
    }

    if (filters.tags?.length) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters.searchTerm) {
      where.OR = [
        { title: { contains: filters.searchTerm, mode: 'insensitive' } },
        { content: { contains: filters.searchTerm, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.knowledgeArticle.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Knowledge article with ID ${id} not found`);
    }
  }

  private mapArticle(article: KnowledgeArticleRecord): KnowledgeArticleModel {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags,
      publishedAt: article.publishedAt ?? undefined,
      author: {
        id: article.authorId,
        name: article.author?.name ?? undefined,
        email: article.author?.email ?? undefined,
      },
      department: article.department
        ? {
            id: article.department.id,
            name: article.department.name,
          }
        : undefined,
      skillIds: article.skillLinks.map((link) => link.skillId),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  private get defaultInclude() {
    return {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      skillLinks: true,
    } satisfies Prisma.KnowledgeArticleInclude;
  }
}

type KnowledgeArticleRecord = Prisma.KnowledgeArticleGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    department: {
      select: {
        id: true;
        name: true;
      };
    } | null;
    skillLinks: true;
  };
}>;

export type KnowledgeArticleModel = {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  publishedAt?: Date;
  author: {
    id: string;
    name?: string;
    email?: string;
  };
  department?: {
    id: string;
    name: string;
  };
  skillIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
