import { Module } from '@nestjs/common';
import { ChatbotInteractionsService } from './chatbot-interactions.service';
import { ChatbotInteractionsController } from './chatbot-interactions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [ChatbotInteractionsController],
    providers: [ChatbotInteractionsService, PrismaService],
})
export class ChatbotInteractionsModule { }
