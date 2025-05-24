import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class SkillProficiencyService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number) {
    await this.prisma.skillProficiency.delete({
      where: { id },
    });
    return { success: true };
  }
}
