import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Employees } from '@prisma/client';
import { SkillsService } from '../skills/skills.service';

@Injectable()
export class EmployeesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly skillsService: SkillsService,
    ) { }

    async findAll(): Promise<Employees[]> {
        return this.prisma.employees.findMany();
    }

    async findOne(id: number): Promise<Employees | null> {
        return this.prisma.employees.findUnique({ where: { id } });
    }

    async create(data: Prisma.EmployeesCreateInput): Promise<Employees> {
        return this.prisma.employees.create({ data });
    }

    async update(id: number, data: Prisma.EmployeesUpdateInput): Promise<Employees> {
        return this.prisma.employees.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<Employees> {
        return this.prisma.employees.delete({ where: { id } });
    }


}
