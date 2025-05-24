import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateKnowledgeBaseInput } from '@application/graphql/inputs/create-knowledge-base.input';
import { UpdateKnowledgeBaseInput } from '@application/graphql/inputs/update-knowledge-base.input';
import { KnowledgeBase } from '@application/graphql/types/knowledge-base.type';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<KnowledgeBase[]> {
    const result = await this.prisma.knowledgeBase.findMany({
      include: {
        employee: true,
        skills: true,
      },
    });

    return result.map((knowledgeBase) => ({
      id: knowledgeBase.id.toString(),
      employeeId: knowledgeBase.employeeId.toString(),
      title: knowledgeBase.title,
      content: knowledgeBase.content,
      category: knowledgeBase.category,
      skillIds: knowledgeBase.skills.map((s) => s.id.toString()),
      createdAt: knowledgeBase.createdAt,
      updatedAt: knowledgeBase.updatedAt,
    }));
  }

  async findById(id: string): Promise<KnowledgeBase> {
    const result = await this.prisma.knowledgeBase.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Knowledge base with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      content: result.content,
      category: result.category,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<KnowledgeBase[]> {
    const knowledgeBases = await this.prisma.knowledgeBase.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
        skills: true,
      },
    });

    return knowledgeBases.map((kb) => ({
      id: kb.id.toString(),
      employeeId: kb.employeeId.toString(),
      title: kb.title,
      content: kb.content,
      category: kb.category,
      skillIds: kb.skills.map((s) => s.id.toString()),
      createdAt: kb.createdAt,
      updatedAt: kb.updatedAt,
    }));
  }

  async create(data: CreateKnowledgeBaseInput): Promise<KnowledgeBase> {
    const result = await this.prisma.knowledgeBase.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        content: data.content,
        category: data.category,
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
      content: result.content,
      category: result.category,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateKnowledgeBaseInput): Promise<KnowledgeBase> {
    const result = await this.prisma.knowledgeBase.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
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
      content: result.content,
      category: result.category,
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.knowledgeBase.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
