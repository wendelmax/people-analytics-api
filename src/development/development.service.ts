import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Development_Items } from '@prisma/client';

@Injectable()
export class DevelopmentService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Development_Items[]> {
        return this.prisma.development_Items.findMany();
    }

    async create(data: Prisma.Development_ItemsCreateInput): Promise<Development_Items> {
        return this.prisma.development_Items.create({ data });
    }

    async update(id: number, data: Prisma.Development_ItemsUpdateInput): Promise<Development_Items> {
        return this.prisma.development_Items.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<Development_Items> {
        return this.prisma.development_Items.delete({
            where: { id },
        });
    }
}
