import { Module } from '@nestjs/common';
import { EmployeeJourneyService } from './employee-journey.service';
import { EmployeeJourneyController } from './employee-journey.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [EmployeeJourneyController],
    providers: [EmployeeJourneyService, PrismaService],
})
export class EmployeeJourneyModule { }
