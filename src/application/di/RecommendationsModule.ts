import { Module } from '@nestjs/common';
import { RecommendationsController } from '@application/api/controller/RecommendationsController';
import { RecommendationsService } from '@application/api/service/RecommendationsService';
import { RecommendationsRepository } from '@infrastructure/repository/RecommendationsRepository';

@Module({
  controllers: [RecommendationsController],
  providers: [
    RecommendationsService,
    {
      provide: 'RecommendationsRepository',
      useClass: RecommendationsRepository,
    },
  ],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
