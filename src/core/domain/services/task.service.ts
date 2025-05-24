import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateTaskDto } from '@application/graphql/dto/create-task.dto';
import { UpdateTaskDto } from '@application/graphql/dto/update-task.dto';
import { Task } from '@application/graphql/types/task.type';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    const result = await this.prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
        skills: true,
      },
    });

    return result.map((task) => ({
      id: task.id.toString(),
      projectId: task.projectId.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      assigneeId: task.assigneeId?.toString(),
      skillIds: task.skills.map((s) => s.id.toString()),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  async findById(id: string): Promise<Task> {
    const result = await this.prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
        assignee: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      projectId: result.projectId.toString(),
      title: result.title,
      description: result.description,
      status: result.status,
      priority: result.priority,
      startDate: result.startDate,
      endDate: result.endDate,
      assigneeId: result.assigneeId?.toString(),
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Task[]> {
    const result = await this.prisma.task.findMany({
      where: {
        assigneeId: parseInt(employeeId),
      },
      include: {
        project: true,
        assignee: true,
        skills: true,
      },
    });

    return result.map((task) => ({
      id: task.id.toString(),
      projectId: task.projectId.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      assigneeId: task.assigneeId?.toString(),
      skillIds: task.skills.map((s) => s.id.toString()),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const result = await this.prisma.task.create({
      data: {
        projectId: parseInt(data.projectId),
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        assigneeId: data.assigneeId ? parseInt(data.assigneeId) : undefined,
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        project: true,
        assignee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      projectId: result.projectId.toString(),
      title: result.title,
      description: result.description,
      status: result.status,
      priority: result.priority,
      startDate: result.startDate,
      endDate: result.endDate,
      assigneeId: result.assigneeId?.toString(),
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const result = await this.prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        assigneeId: data.assigneeId ? parseInt(data.assigneeId) : undefined,
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        project: true,
        assignee: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      projectId: result.projectId.toString(),
      title: result.title,
      description: result.description,
      status: result.status,
      priority: result.priority,
      startDate: result.startDate,
      endDate: result.endDate,
      assigneeId: result.assigneeId?.toString(),
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.task.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
