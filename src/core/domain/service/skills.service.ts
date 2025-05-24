import { Injectable } from '@nestjs/common';
import { Prisma, SkillsInventory } from '@prisma/client';
import { PrismaService } from '@core/infrastructure/database/prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SkillsInventory[]> {
    return this.prisma.skillsInventory.findMany();
  }

  async create(data: Prisma.SkillsInventoryCreateInput): Promise<SkillsInventory> {
    return this.prisma.skillsInventory.create({ data });
  }

  async update(id: number, data: Prisma.SkillsInventoryUpdateInput): Promise<SkillsInventory> {
    return this.prisma.skillsInventory.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<SkillsInventory> {
    return this.prisma.skillsInventory.delete({ where: { id } });
  }
}
