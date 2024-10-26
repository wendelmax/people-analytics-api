import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Departments, Positions } from '@prisma/client';

@Injectable()
export class OrganizationalStructureService {
    constructor(private readonly prisma: PrismaService) { }

    // Métodos para Departamentos
    async findAllDepartments(): Promise<Departments[]> {
        return this.prisma.departments.findMany();
    }

    async createDepartment(data: Prisma.DepartmentsCreateInput): Promise<Departments> {
        return this.prisma.departments.create({ data });
    }

    async updateDepartment(id: number, data: Prisma.DepartmentsUpdateInput): Promise<Departments> {
        return this.prisma.departments.update({
            where: { id },
            data,
        });
    }

    async removeDepartment(id: number): Promise<Departments> {
        return this.prisma.departments.delete({ where: { id } });
    }

    // Métodos para Cargos
    async findAllPositions(): Promise<Positions[]> {
        return this.prisma.positions.findMany();
    }

    async createPosition(data: Prisma.PositionsCreateInput): Promise<Positions> {
        return this.prisma.positions.create({ data });
    }

    async updatePosition(id: number, data: Prisma.PositionsUpdateInput): Promise<Positions> {
        return this.prisma.positions.update({
            where: { id },
            data,
        });
    }

    async removePosition(id: number): Promise<Positions> {
        return this.prisma.positions.delete({ where: { id } });
    }
}
