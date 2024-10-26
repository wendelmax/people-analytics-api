import { Module } from '@nestjs/common';
import { OrganizationalStructureService } from './organizational-structure.service';
import { OrganizationalStructureController } from './organizational-structure.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [OrganizationalStructureController],
    providers: [OrganizationalStructureService, PrismaService],
})
export class OrganizationalStructureModule { }
