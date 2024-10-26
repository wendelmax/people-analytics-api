import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Employee_Experience_Journey, Journey_Touchpoints } from '@prisma/client';

@Injectable()
export class EmployeeJourneyService {
    constructor(private readonly prisma: PrismaService) { }

    // Métodos para jornadas de experiência
    async findAllJourneys(): Promise<Employee_Experience_Journey[]> {
        return this.prisma.employee_Experience_Journey.findMany();
    }

    async createJourney(data: Prisma.Employee_Experience_JourneyCreateInput): Promise<Employee_Experience_Journey> {
        return this.prisma.employee_Experience_Journey.create({ data });
    }

    async updateJourney(id: number, data: Prisma.Employee_Experience_JourneyUpdateInput): Promise<Employee_Experience_Journey> {
        return this.prisma.employee_Experience_Journey.update({
            where: { id },
            data,
        });
    }

    async removeJourney(id: number): Promise<Employee_Experience_Journey> {
        return this.prisma.employee_Experience_Journey.delete({ where: { id } });
    }

    // Métodos para pontos de contato (touchpoints)
    async findAllTouchpoints(journeyId: number): Promise<Journey_Touchpoints[]> {
        return this.prisma.journey_Touchpoints.findMany({
            where: { journey_id: journeyId },
        });
    }

    async createTouchpoint(data: Prisma.Journey_TouchpointsCreateInput): Promise<Journey_Touchpoints> {
        return this.prisma.journey_Touchpoints.create({ data });
    }

    async updateTouchpoint(id: number, data: Prisma.Journey_TouchpointsUpdateInput): Promise<Journey_Touchpoints> {
        return this.prisma.journey_Touchpoints.update({
            where: { id },
            data,
        });
    }

    async removeTouchpoint(id: number): Promise<Journey_Touchpoints> {
        return this.prisma.journey_Touchpoints.delete({ where: { id } });
    }
}
