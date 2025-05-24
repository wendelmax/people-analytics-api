import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number) {
    await this.prisma.project.delete({
      where: { id },
    });
    return { success: true };
  }
}
