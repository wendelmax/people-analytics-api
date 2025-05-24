import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateProjectDto } from '@application/graphql/dto/create-project.dto';
import { UpdateProjectDto } from '@application/graphql/dto/update-project.dto';
import { Project } from '@application/graphql/types/project.type';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Project[]> {
    const result = await this.prisma.project.findMany({
      include: {
        team: true,
        tasks: true,
        skills: true,
      },
    });

    return result.map((project) => ({
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      budget: project.budget,
      teamIds: project.team.map((e) => e.id.toString()),
      taskIds: project.tasks.map((t) => t.id.toString()),
      skillIds: project.skills.map((s) => s.id.toString()),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  async findById(id: string): Promise<Project> {
    const result = await this.prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        team: true,
        tasks: true,
        skills: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      budget: result.budget,
      teamIds: result.team.map((e) => e.id.toString()),
      taskIds: result.tasks.map((t) => t.id.toString()),
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Project[]> {
    const result = await this.prisma.project.findMany({
      where: {
        team: {
          some: {
            id: parseInt(employeeId),
          },
        },
      },
      include: {
        team: true,
        tasks: true,
        skills: true,
      },
    });

    return result.map((project) => ({
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      budget: project.budget,
      teamIds: project.team.map((e) => e.id.toString()),
      taskIds: project.tasks.map((t) => t.id.toString()),
      skillIds: project.skills.map((s) => s.id.toString()),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  async create(data: CreateProjectDto): Promise<Project> {
    const result = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        budget: data.budget,
        team: {
          connect: data.teamIds.map((id) => ({ id: parseInt(id) })),
        },
        tasks: {
          connect: data.taskIds.map((id) => ({ id: parseInt(id) })),
        },
        skills: {
          connect: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        team: true,
        tasks: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      budget: result.budget,
      teamIds: result.team.map((e) => e.id.toString()),
      taskIds: result.tasks.map((t) => t.id.toString()),
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const result = await this.prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        budget: data.budget,
        team: {
          set: data.teamIds.map((id) => ({ id: parseInt(id) })),
        },
        tasks: {
          set: data.taskIds.map((id) => ({ id: parseInt(id) })),
        },
        skills: {
          set: data.skillIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        team: true,
        tasks: true,
        skills: true,
      },
    });

    return {
      id: result.id.toString(),
      name: result.name,
      description: result.description,
      startDate: result.startDate,
      endDate: result.endDate,
      status: result.status,
      budget: result.budget,
      teamIds: result.team.map((e) => e.id.toString()),
      taskIds: result.tasks.map((t) => t.id.toString()),
      skillIds: result.skills.map((s) => s.id.toString()),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.project.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
