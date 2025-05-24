import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/infrastructure/database/prisma/prisma.service';
import { CreateCareerPathwayDto, UpdateCareerPathwayDto } from '@shared/dto/base.dto';

@Injectable()
export class CareerPathwayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCareerPathwayDto: CreateCareerPathwayDto) {
    return this.prisma.careerPathway.create({
      data: {
        name: createCareerPathwayDto.name,
        description: createCareerPathwayDto.description,
        fromPosition: {
          connect: { id: createCareerPathwayDto.fromPosition },
        },
        toPosition: {
          connect: { id: createCareerPathwayDto.toPosition },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.careerPathway.findMany({
      include: {
        fromPosition: true,
        toPosition: true,
      },
    });
  }

  async findOne(id: number) {
    const pathway = await this.prisma.careerPathway.findUnique({
      where: { id },
      include: {
        fromPosition: true,
        toPosition: true,
      },
    });

    if (!pathway) {
      throw new NotFoundException(`Career Pathway with ID ${id} not found`);
    }

    return pathway;
  }

  async update(id: number, updateCareerPathwayDto: UpdateCareerPathwayDto) {
    await this.findOne(id); // Verificar se existe

    return this.prisma.careerPathway.update({
      where: { id },
      data: {
        name: updateCareerPathwayDto.name,
        description: updateCareerPathwayDto.description,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar se existe

    return this.prisma.careerPathway.delete({
      where: { id },
    });
  }
}
