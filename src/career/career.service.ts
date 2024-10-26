import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Career_Positions, Career_Pathways } from '@prisma/client';

@Injectable()
export class CareerService {
    constructor(private readonly prisma: PrismaService) { }

    // Métodos para gerenciamento de posições de carreira

    async findAllPositions(): Promise<Career_Positions[]> {
        return this.prisma.career_Positions.findMany();
    }

    async createPosition(data: Prisma.Career_PositionsCreateInput): Promise<Career_Positions> {
        return this.prisma.career_Positions.create({
            data,
        });
    }

    async updatePosition(id: number, data: Prisma.Career_PositionsUpdateInput): Promise<Career_Positions> {
        return this.prisma.career_Positions.update({
            where: { id },
            data,
        });
    }

    async removePosition(id: number): Promise<Career_Positions> {
        return this.prisma.career_Positions.delete({
            where: { id },
        });
    }

    // Métodos para gerenciamento de caminhos de carreira

    async findAllPathways(): Promise<Career_Pathways[]> {
        return this.prisma.career_Pathways.findMany();
    }

    async createPathway(data: Prisma.Career_PathwaysCreateInput): Promise<Career_Pathways> {
        return this.prisma.career_Pathways.create({
            data,
        });
    }

    async updatePathway(id: number, data: Prisma.Career_PathwaysUpdateInput): Promise<Career_Pathways> {
        return this.prisma.career_Pathways.update({
            where: { id },
            data,
        });
    }

    async removePathway(id: number): Promise<Career_Pathways> {
        return this.prisma.career_Pathways.delete({
            where: { id },
        });
    }
}
