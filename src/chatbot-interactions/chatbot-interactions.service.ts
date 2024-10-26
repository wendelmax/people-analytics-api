import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chatbot_Interaction } from '@prisma/client';

@Injectable()
export class ChatbotInteractionsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllInteractions(employeeId: number): Promise<Chatbot_Interaction[]> {
        return this.prisma.chatbot_Interaction.findMany({
            where: { employee_id: employeeId },
        });
    }

    async createInteraction(data: any): Promise<Chatbot_Interaction> {
        return this.prisma.chatbot_Interaction.create({ data });
    }
}
