import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateCareerPathDto, UpdateCareerPathDto } from '@application/api/dto/career-path.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerPathService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CareerPathModel[]> {
    const paths = await this.prisma.careerPath.findMany({
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
        positionLinks: true,
        skillLinks: true,
      },
      orderBy: { name: 'asc' },
    });

    return paths.map((path) => this.mapToModel(path));
  }

  async findById(id: string): Promise<CareerPathModel> {
    const path = await this.prisma.careerPath.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
        positionLinks: true,
        skillLinks: true,
      },
    });

    if (!path) {
      throw new NotFoundException(`Career path with ID ${id} not found`);
    }

    return this.mapToModel(path);
  }

  async create(data: CreateCareerPathDto): Promise<CareerPathModel> {
    const path = await this.prisma.careerPath.create({
      data: {
        name: data.name,
        description: data.description,
        positionLinks: data.positions?.length
          ? {
              createMany: {
                data: data.positions.map((positionId) => ({ positionId })),
              },
            }
          : undefined,
        skillLinks: data.skills?.length
          ? {
              createMany: {
                data: data.skills.map((skillId) => ({ skillId })),
              },
            }
          : undefined,
      },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
        positionLinks: true,
        skillLinks: true,
      },
    });

    return this.mapToModel(path);
  }

  async update(id: string, data: UpdateCareerPathDto): Promise<CareerPathModel> {
    await this.ensureExists(id);

    const path = await this.prisma.careerPath.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        positionLinks: data.positions
          ? {
              deleteMany: {},
              createMany: {
                data: data.positions.map((positionId) => ({ positionId })),
              },
            }
          : undefined,
        skillLinks: data.skills
          ? {
              deleteMany: {},
              createMany: {
                data: data.skills.map((skillId) => ({ skillId })),
              },
            }
          : undefined,
      },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
        positionLinks: true,
        skillLinks: true,
      },
    });

    return this.mapToModel(path);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.careerPath.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.careerPath.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Career path with ID ${id} not found`);
    }
  }

  private mapToModel(path: CareerPathRecord): CareerPathModel {
    return {
      id: path.id,
      name: path.name,
      description: path.description ?? undefined,
      stages: path.stages
        .sort((a, b) => a.order - b.order)
        .map((stage) => ({
          id: stage.id,
          title: stage.title,
          description: stage.description ?? undefined,
          order: stage.order,
        })),
      positionIds: path.positionLinks.map((link) => link.positionId),
      skillIds: path.skillLinks.map((link) => link.skillId),
      createdAt: path.createdAt,
      updatedAt: path.updatedAt,
    };
  }
}

type CareerPathRecord = Prisma.CareerPathGetPayload<{
  include: {
    stages: true;
    positionLinks: true;
    skillLinks: true;
  };
}>;

export type CareerPathModel = {
  id: string;
  name: string;
  description?: string;
  stages: {
    id: string;
    title: string;
    description?: string;
    order: number;
  }[];
  positionIds: string[];
  skillIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
