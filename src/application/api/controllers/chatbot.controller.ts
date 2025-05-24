import { Controller, Post, Body, Get, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AIService } from '@core/common/services/AIService';
import { ChatbotService } from '@core/domain/chatbot/service/ChatbotService';
import {
  ChatbotInteractionDto,
  ChatbotContextDto,
  ChatbotTrainingDto,
  ChatbotFeedbackDto,
} from '@core/domain/chatbot/dto/ChatbotDto';
import { CreateChatbotDto } from '@core/domain/chatbot/dto/ChatbotDto';
import { UpdateChatbotDto } from '@core/domain/chatbot/dto/ChatbotDto';

@ApiTags('Chatbot')
@Controller('chatbot')
@ApiBearerAuth()
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly aiService: AIService,
  ) {}

  @Post('interact')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Interage com o chatbot' })
  async interact(
    @Body() interactionDto: ChatbotInteractionDto,
    @Query('context') context?: string,
  ) {
    const enrichedContext = await this.chatbotService.enrichContext(interactionDto, context);
    return this.aiService.generateResponse(interactionDto.message, enrichedContext, {
      detailLevel: 'conversational',
    });
  }

  @Post('analyze-performance')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Analisa performance via chatbot' })
  async analyzePerformance(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const performanceContext = await this.chatbotService.createPerformanceContext(contextDto);
    return this.aiService.generateResponse(
      'Analise a performance do colaborador',
      performanceContext,
      { detailLevel },
    );
  }

  @Post('career-guidance')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Fornece orientação de carreira via chatbot' })
  async getCareerGuidance(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const careerContext = await this.chatbotService.createCareerContext(contextDto);
    return this.aiService.generateResponse('Forneça orientação de carreira', careerContext, {
      detailLevel,
    });
  }

  @Post('skills-assessment')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Avalia habilidades via chatbot' })
  async assessSkills(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const skillsContext = await this.chatbotService.createSkillsContext(contextDto);
    return this.aiService.generateResponse('Avalie as habilidades do colaborador', skillsContext, {
      detailLevel,
    });
  }

  @Post('engagement-feedback')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Obtém feedback de engajamento via chatbot' })
  async getEngagementFeedback(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const engagementContext = await this.chatbotService.createEngagementContext(contextDto);
    return this.aiService.generateResponse('Analise o engajamento', engagementContext, {
      detailLevel,
    });
  }

  @Get('conversation-history/:userId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Obtém histórico de conversas do usuário' })
  async getConversationHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.chatbotService.getConversationHistory(userId, { limit, offset });
  }

  @Post('train')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Treina o chatbot com novos dados' })
  async trainChatbot(@Body() trainingDto: ChatbotTrainingDto) {
    return this.chatbotService.trainWithNewData(trainingDto);
  }

  @Post('feedback')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Envia feedback sobre a resposta do chatbot' })
  async sendFeedback(@Body() feedbackDto: ChatbotFeedbackDto) {
    return this.chatbotService.processFeedback(feedbackDto);
  }

  @Get('suggestions/:userId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Obtém sugestões personalizadas baseadas no histórico' })
  async getSuggestions(@Param('userId') userId: string, @Query('context') context?: string) {
    return this.chatbotService.generateSuggestions(userId, context);
  }

  @Post('context/update')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Atualiza o contexto da conversa' })
  async updateContext(@Body() contextDto: ChatbotContextDto) {
    return this.chatbotService.updateConversationContext(contextDto);
  }

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new chatbot interaction' })
  @ApiResponse({ status: 201, description: 'Chatbot interaction created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createChatbotDto: CreateChatbotDto) {
    return this.chatbotService.create(createChatbotDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all chatbot interactions' })
  @ApiResponse({ status: 200, description: 'List of chatbot interactions' })
  findAll() {
    return this.chatbotService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get chatbot interaction by ID' })
  @ApiResponse({ status: 200, description: 'Chatbot interaction details' })
  @ApiResponse({ status: 404, description: 'Chatbot interaction not found' })
  findOne(@Param('id') id: string) {
    return this.chatbotService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update chatbot interaction details' })
  @ApiResponse({ status: 200, description: 'Chatbot interaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Chatbot interaction not found' })
  update(@Param('id') id: string, @Body() updateChatbotDto: UpdateChatbotDto) {
    return this.chatbotService.update(id, updateChatbotDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a chatbot interaction' })
  @ApiResponse({ status: 200, description: 'Chatbot interaction removed successfully' })
  @ApiResponse({ status: 404, description: 'Chatbot interaction not found' })
  remove(@Param('id') id: string) {
    return this.chatbotService.remove(id);
  }
}
