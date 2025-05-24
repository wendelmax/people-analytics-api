import { Module } from '@nestjs/common';
import { FeedbackController } from '@application/api/controller/FeedbackController';
import { FeedbackService } from '@application/api/service/FeedbackService';
import { FeedbackRepository } from '@infrastructure/repository/FeedbackRepository';

@Module({
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    {
      provide: 'FeedbackRepository',
      useClass: FeedbackRepository,
    },
  ],
  exports: [FeedbackService],
})
export class FeedbackModule {}
