import { Module } from '@nestjs/common';
import { ChatbotController } from '@application/api/controllers/chatbot.controller';
import { ChatbotService } from '@core/domain/chatbot/service/ChatbotService';
import { AIService } from '@core/common/services/AIService';
import { PrismaService } from '@database/prisma/prisma.service';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, AIService, PrismaService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
