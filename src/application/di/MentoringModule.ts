import { Module } from '@nestjs/common';
import { MentoringController } from '@application/api/controller/MentoringController';
import { MentoringService } from '@application/api/service/MentoringService';
import { MentoringRepository } from '@infrastructure/repository/MentoringRepository';
import { MentoringResolver } from '@application/graphql/resolvers/mentoring.resolver';

@Module({
  controllers: [MentoringController],
  providers: [
    MentoringService,
    MentoringResolver,
    {
      provide: 'MentoringRepository',
      useClass: MentoringRepository,
    },
  ],
  exports: [MentoringService],
})
export class MentoringModule {}
