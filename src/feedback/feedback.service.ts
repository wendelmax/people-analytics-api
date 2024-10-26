import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Employee_Feedback } from '@prisma/client';

@Injectable()
export class FeedbackService {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmployee(employeeId: number): Promise<Employee_Feedback[]> {
        return this.prisma.employee_Feedback.findMany({
            where: { employee_id: employeeId },
        });
    }

    async create(data: Prisma.Employee_FeedbackCreateInput): Promise<Employee_Feedback> {
        return this.prisma.employee_Feedback.create({ data });
    }
}
