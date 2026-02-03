import { Controller, Post, Body, Get, Param, Query, Patch, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AIService } from '@core/domain/service/ai.service';
import { ChatbotService } from '@core/domain/service/chatbot.service';
import {
  ChatbotContextDto,
  ChatbotTrainingDto,
  ChatbotFeedbackDto,
} from '@core/domain/chatbot/dto/ChatbotDto';
import { CreateChatbotDto } from '@core/domain/chatbot/dto/ChatbotDto';
import { UpdateChatbotDto } from '@core/domain/chatbot/dto/ChatbotDto';
import { randomUUID } from 'crypto';

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
  @ApiOperation({ summary: 'Interact with chatbot' })
  @ApiQuery({ name: 'context', required: false, description: 'Context for the conversation' })
  async interact(@Body() body: { message: string; userId?: string }, @Query('context') context?: string) {
    const interactionDto = { message: body.message, userId: body.userId ?? 'anonymous' };
    const enrichedContext = await this.chatbotService.enrichContext(interactionDto, context);
    const response = await this.aiService.generateResponse(interactionDto.message, enrichedContext);
    return {
      id: randomUUID(),
      message: body.message,
      response: response,
      context: context,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('analyze-performance')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Analyze performance via chatbot' })
  @ApiQuery({ name: 'employeeId', required: true, description: 'Employee ID' })
  @ApiQuery({
    name: 'detailLevel',
    required: false,
    enum: ['basic', 'detailed', 'technical'],
    description: 'Detail level',
  })
  async analyzePerformance(
    @Query('employeeId') employeeId: string,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const contextDto = { userId: employeeId };
    const performanceContext = await this.chatbotService.createPerformanceContext(contextDto);
    const response = await this.aiService.generateResponse(
      'Analise a performance do colaborador',
      performanceContext,
    );
    return {
      employeeId,
      analysis: response,
      detailLevel: detailLevel || 'basic',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('career-guidance')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Fornece orientação de carreira via chatbot' })
  @ApiQuery({
    name: 'detailLevel',
    required: false,
    enum: ['basic', 'detailed', 'technical'],
    description: 'Nível de detalhe da resposta',
  })
  async getCareerGuidance(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const careerContext = await this.chatbotService.createCareerContext(contextDto);
    return this.aiService.generateResponse('Forneça orientação de carreira', careerContext);
  }

  @Post('skills-assessment')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Avalia habilidades via chatbot' })
  @ApiQuery({
    name: 'detailLevel',
    required: false,
    enum: ['basic', 'detailed', 'technical'],
    description: 'Nível de detalhe da resposta',
  })
  async assessSkills(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const skillsContext = await this.chatbotService.createSkillsContext(contextDto);
    return this.aiService.generateResponse('Avalie as habilidades do colaborador', skillsContext);
  }

  @Post('engagement-feedback')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Obtém feedback de engajamento via chatbot' })
  @ApiQuery({
    name: 'detailLevel',
    required: false,
    enum: ['basic', 'detailed', 'technical'],
    description: 'Nível de detalhe da resposta',
  })
  async getEngagementFeedback(
    @Body() contextDto: ChatbotContextDto,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const engagementContext = await this.chatbotService.createEngagementContext(contextDto);
    return this.aiService.generateResponse('Analise o engajamento', engagementContext);
  }

  @Get('conversation-history/:userId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Obtém histórico de conversas do usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de resultados',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Número de resultados para pular',
  })
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
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiQuery({ name: 'context', required: false, description: 'Contexto para as sugestões' })
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
  @ApiParam({ name: 'id', description: 'ID da interação do chatbot' })
  @ApiResponse({ status: 200, description: 'Chatbot interaction details' })
  @ApiResponse({ status: 404, description: 'Chatbot interaction not found' })
  findOne(@Param('id') id: string) {
    return this.chatbotService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update chatbot interaction details' })
  @ApiParam({ name: 'id', description: 'ID da interação do chatbot' })
  @ApiResponse({ status: 200, description: 'Chatbot interaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Chatbot interaction not found' })
  update(@Param('id') id: string, @Body() updateChatbotDto: UpdateChatbotDto) {
    return this.chatbotService.update(id, updateChatbotDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a chatbot interaction' })
  @ApiParam({ name: 'id', description: 'ID da interação do chatbot' })
  @ApiResponse({ status: 200, description: 'Chatbot interaction removed successfully' })
  @ApiResponse({ status: 404, description: 'Chatbot interaction not found' })
  remove(@Param('id') id: string) {
    return this.chatbotService.remove(id);
  }
}
