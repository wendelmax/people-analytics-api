import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: string) {
    await this.prisma.skill.delete({
      where: { id },
    });
    return { success: true };
  }
}
