import { Module } from '@nestjs/common';
import { DevelopmentService } from './development.service';
import { DevelopmentController } from './development.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [DevelopmentController],
    providers: [DevelopmentService, PrismaService],
})
export class DevelopmentModule { }
