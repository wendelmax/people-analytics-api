import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class WorkforcePlanningService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number) {
    await this.prisma.workforcePlanning.delete({
      where: { id },
    });
    return { success: true };
  }
}
