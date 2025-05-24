import { Module } from '@nestjs/common';
import { TrainingController } from '@application/api/controller/TrainingController';
import { TrainingService } from '@application/api/service/TrainingService';
import { TrainingRepository } from '@infrastructure/repository/TrainingRepository';
import { TrainingResolver } from '@application/graphql/resolvers/training.resolver';

@Module({
  controllers: [TrainingController],
  providers: [
    TrainingService,
    TrainingResolver,
    {
      provide: 'TrainingRepository',
      useClass: TrainingRepository,
    },
  ],
  exports: [TrainingService],
})
export class TrainingModule {}
