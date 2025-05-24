import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number) {
    await this.prisma.skillsInventory.delete({
      where: { id },
    });
    return { success: true };
  }
}
