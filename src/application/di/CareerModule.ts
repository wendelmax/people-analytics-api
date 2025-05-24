import { Module } from '@nestjs/common';
import { CareerController } from '@application/api/controller/CareerController';
import { CareerService } from '@application/api/service/CareerService';
import { CareerRepository } from '@infrastructure/repository/CareerRepository';
import { CareerResolver } from '@application/api/graphql/resolvers/career.resolver';

@Module({
  controllers: [CareerController],
  providers: [
    CareerService,
    CareerResolver,
    {
      provide: 'CareerRepository',
      useClass: CareerRepository,
    },
  ],
  exports: [CareerService],
})
export class CareerModule {}
