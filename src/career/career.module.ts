import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [CareerController],
    providers: [CareerService, PrismaService],
})
export class CareerModule { }
