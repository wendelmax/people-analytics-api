import { Module } from '@nestjs/common';
import { OrganizationalStructureController } from '@application/api/controller/OrganizationalStructureController';
import { OrganizationalStructureService } from '@application/api/service/OrganizationalStructureService';
import { OrganizationalStructureRepository } from '@infrastructure/repository/OrganizationalStructureRepository';

@Module({
  controllers: [OrganizationalStructureController],
  providers: [
    OrganizationalStructureService,
    {
      provide: 'OrganizationalStructureRepository',
      useClass: OrganizationalStructureRepository,
    },
  ],
  exports: [OrganizationalStructureService],
})
export class OrganizationalStructureModule {}
