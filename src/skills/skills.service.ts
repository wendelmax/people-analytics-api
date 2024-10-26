import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Skills_Inventory } from '@prisma/client';

@Injectable()
export class SkillsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Skills_Inventory[]> {
        return this.prisma.skills_Inventory.findMany();
    }

    async create(data: Prisma.Skills_InventoryCreateInput): Promise<Skills_Inventory> {
        return this.prisma.skills_Inventory.create({ data });
    }

    async update(id: number, data: Prisma.Skills_InventoryUpdateInput): Promise<Skills_Inventory> {
        return this.prisma.skills_Inventory.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<Skills_Inventory> {
        return this.prisma.skills_Inventory.delete({ where: { id } });
    }
}
