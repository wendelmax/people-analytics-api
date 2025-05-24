import { Module } from '@nestjs/common';
import { ChatbotInteractionsController } from '@application/api/controller/ChatbotInteractionsController';
import { ChatbotInteractionsService } from '@application/api/service/ChatbotInteractionsService';
import { ChatbotInteractionsRepository } from '@infrastructure/repository/ChatbotInteractionsRepository';

@Module({
  controllers: [ChatbotInteractionsController],
  providers: [
    ChatbotInteractionsService,
    {
      provide: 'ChatbotInteractionsRepository',
      useClass: ChatbotInteractionsRepository,
    },
  ],
  exports: [ChatbotInteractionsService],
})
export class ChatbotInteractionsModule {}
