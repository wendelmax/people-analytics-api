import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatbotInteractionsService } from './chatbot-interactions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('chatbot-interactions')
@Controller('chatbot-interactions')
export class ChatbotInteractionsController {
    constructor(private readonly chatbotService: ChatbotInteractionsService) { }

    @Get(':employeeId')
    findAllInteractions(@Param('employeeId') employeeId: string) {
        return this.chatbotService.findAllInteractions(+employeeId);
    }

    @Post()
    createInteraction(@Body() interactionData: any) {
        return this.chatbotService.createInteraction(interactionData);
    }
}
