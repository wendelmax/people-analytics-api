import { Module } from '@nestjs/common';
import { RecognitionController } from '@application/api/controller/RecognitionController';
import { RecognitionService } from '@application/api/service/RecognitionService';
import { RecognitionRepository } from '@infrastructure/repository/RecognitionRepository';

@Module({
  controllers: [RecognitionController],
  providers: [
    RecognitionService,
    {
      provide: 'RecognitionRepository',
      useClass: RecognitionRepository,
    },
  ],
  exports: [RecognitionService],
})
export class RecognitionModule {}
