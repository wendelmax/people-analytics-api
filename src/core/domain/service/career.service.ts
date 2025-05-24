import { Injectable } from '@nestjs/common';
import { Prisma, CareerPosition, CareerPathway } from '@prisma/client';
import { PrismaService } from '@core/infrastructure/database/prisma/prisma.service';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  // Métodos para gerenciamento de posições de carreira

  async findAllPositions(): Promise<CareerPosition[]> {
    return this.prisma.careerPosition.findMany();
  }

  async createPosition(data: Prisma.CareerPositionCreateInput): Promise<CareerPosition> {
    return this.prisma.careerPosition.create({
      data,
    });
  }

  async updatePosition(
    id: number,
    data: Prisma.CareerPositionUpdateInput,
  ): Promise<CareerPosition> {
    return this.prisma.careerPosition.update({
      where: { id },
      data,
    });
  }

  async removePosition(id: number): Promise<CareerPosition> {
    return this.prisma.careerPosition.delete({
      where: { id },
    });
  }

  // Métodos para gerenciamento de caminhos de carreira

  async findAllPathways(): Promise<CareerPathway[]> {
    return this.prisma.careerPathway.findMany();
  }

  async createPathway(data: Prisma.CareerPathwayCreateInput): Promise<CareerPathway> {
    return this.prisma.careerPathway.create({
      data,
    });
  }

  async updatePathway(id: number, data: Prisma.CareerPathwayUpdateInput): Promise<CareerPathway> {
    return this.prisma.careerPathway.update({
      where: { id },
      data,
    });
  }

  async removePathway(id: number): Promise<CareerPathway> {
    return this.prisma.careerPathway.delete({
      where: { id },
    });
  }
}
