import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from '@application/api/dto/project.dto';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProjectModel[]> {
    const projects = await this.prisma.project.findMany({
      include: {
        owner: true,
        team: true,
        requiredSkills: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return projects.map((project) => this.mapToModel(project));
  }

  async findById(id: string): Promise<ProjectModel> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        team: true,
        requiredSkills: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.mapToModel(project);
  }

  async create(data: CreateProjectDto): Promise<ProjectModel> {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
        budget: data.budget,
        owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
        requiredSkills: data.skillIds?.length
          ? {
              create: data.skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
        team: data.team?.length
          ? {
              create: data.team.map((member) => ({
                employeeId: member.employeeId,
                role: member.role,
                startDate: new Date(member.startDate),
                endDate: member.endDate ? new Date(member.endDate) : undefined,
              })),
            }
          : undefined,
      },
      include: {
        owner: true,
        team: true,
        requiredSkills: true,
      },
    });

    return this.mapToModel(project);
  }

  async update(id: string, data: UpdateProjectDto): Promise<ProjectModel> {
    await this.ensureExists(id);

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
        budget: data.budget,
        owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
        requiredSkills: data.skillIds
          ? {
              deleteMany: {},
              create: data.skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
        team: data.team
          ? {
              deleteMany: {},
              create: data.team.map((member) => ({
                employeeId: member.employeeId,
                role: member.role,
                startDate: new Date(member.startDate),
                endDate: member.endDate ? new Date(member.endDate) : undefined,
              })),
            }
          : undefined,
      },
      include: {
        owner: true,
        team: true,
        requiredSkills: true,
      },
    });

    return this.mapToModel(project);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.project.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  private mapToModel(project: ProjectWithRelations): ProjectModel {
    return {
      id: project.id,
      name: project.name,
      description: project.description ?? undefined,
      startDate: project.startDate,
      endDate: project.endDate ?? undefined,
      status: project.status,
      budget: project.budget ?? undefined,
      ownerId: project.ownerId ?? undefined,
      skillIds: project.requiredSkills.map((link) => link.skillId),
      teamMembers: project.team.map((member) => ({
        id: member.id,
        employeeId: member.employeeId,
        role: member.role ?? undefined,
        startDate: member.startDate,
        endDate: member.endDate ?? undefined,
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}

type ProjectWithRelations = {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  budget: number | null;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  owner?: { id: string } | null;
  team: {
    id: string;
    employeeId: string;
    role: string | null;
    startDate: Date;
    endDate: Date | null;
  }[];
  requiredSkills: {
    skillId: string;
  }[];
};

export type ProjectModel = {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  budget?: number;
  ownerId?: string;
  skillIds: string[];
  teamMembers: Array<{
    id: string;
    employeeId: string;
    role?: string;
    startDate: Date;
    endDate?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};
