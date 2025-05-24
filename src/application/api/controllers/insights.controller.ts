import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AIService } from '@core/common/services/AIService';
import {
  PerformanceContext,
  CareerContext,
  SkillsContext,
  EngagementContext,
} from '@core/common/type/AIContextTypes';
import { PerformanceInsightsService } from '@core/common/service/PerformanceInsightsService';
import { CareerInsightsService } from '@core/common/service/CareerInsightsService';
import { SkillsInsightsService } from '@core/common/service/SkillsInsightsService';
import { EngagementInsightsService } from '@core/common/service/EngagementInsightsService';
import { CreatePerformanceInsightDto } from '@core/common/dto/CreatePerformanceInsightDto';
import { CreateInsightDto } from '../../../shared/dto/base.dto';
import { UpdateInsightDto } from '../../../shared/dto/base.dto';
import { InsightsService } from '../../../domain/insights/services/insights.service';

@ApiTags('insights')
@Controller('insights')
@ApiBearerAuth()
export class InsightsController {
  constructor(
    private readonly aiService: AIService,
    private readonly performanceInsightsService: PerformanceInsightsService,
    private readonly careerInsightsService: CareerInsightsService,
    private readonly skillsInsightsService: SkillsInsightsService,
    private readonly engagementInsightsService: EngagementInsightsService,
    private readonly insightsService: InsightsService,
  ) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new insight' })
  @ApiResponse({ status: 201, description: 'Insight created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createInsightDto: CreateInsightDto) {
    return this.insightsService.create(createInsightDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all insights' })
  @ApiResponse({ status: 200, description: 'List of insights' })
  findAll() {
    return this.insightsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get insight by ID' })
  @ApiResponse({ status: 200, description: 'Insight details' })
  @ApiResponse({ status: 404, description: 'Insight not found' })
  findOne(@Param('id') id: string) {
    return this.insightsService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update insight details' })
  @ApiResponse({ status: 200, description: 'Insight updated successfully' })
  @ApiResponse({ status: 404, description: 'Insight not found' })
  update(@Param('id') id: string, @Body() updateInsightDto: UpdateInsightDto) {
    return this.insightsService.update(id, updateInsightDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove an insight' })
  @ApiResponse({ status: 200, description: 'Insight removed successfully' })
  @ApiResponse({ status: 404, description: 'Insight not found' })
  remove(@Param('id') id: string) {
    return this.insightsService.remove(id);
  }

  // Performance Insights
  @Post('performance')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Criar novo insight de performance' })
  createPerformanceInsight(@Body() createDto: CreatePerformanceInsightDto) {
    return this.performanceInsightsService.createPerformanceInsight(createDto);
  }

  @Get('performance/employee/:employeeId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER, UserRole.TEAM_LEADER)
  @ApiOperation({ summary: 'Obter insights de performance de um colaborador' })
  findPerformanceInsightsByEmployee(@Param('employeeId') employeeId: string) {
    return this.performanceInsightsService.findPerformanceInsightsByEmployee(+employeeId);
  }

  // Career Insights
  @Get('career/employee/:employeeId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Obter insights de carreira de um colaborador' })
  findCareerInsightsByEmployee(@Param('employeeId') employeeId: string) {
    return this.careerInsightsService.findCareerInsightsByEmployee(+employeeId);
  }

  // Skills Insights
  @Get('skills/employee/:employeeId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER, UserRole.TEAM_LEADER)
  @ApiOperation({ summary: 'Obter insights de habilidades de um colaborador' })
  findSkillsInsightsByEmployee(@Param('employeeId') employeeId: string) {
    return this.skillsInsightsService.findSkillsInsightsByEmployee(+employeeId);
  }

  // Engagement Insights
  @Get('engagement/team/:teamId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER, UserRole.TEAM_LEADER)
  @ApiOperation({ summary: 'Obter insights de engajamento de uma equipe' })
  findEngagementInsightsByTeam(@Param('teamId') teamId: string) {
    return this.engagementInsightsService.findEngagementInsightsByTeam(+teamId);
  }

  // Insights Gerais
  @Get('dashboard')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER, UserRole.TEAM_LEADER)
  @ApiOperation({ summary: 'Obter dashboard com todos os insights' })
  getInsightsDashboard(@Query('departmentId') departmentId?: string) {
    return {
      performance: this.performanceInsightsService.getDepartmentPerformance(departmentId),
      career: this.careerInsightsService.getDepartmentCareer(departmentId),
      skills: this.skillsInsightsService.getDepartmentSkills(departmentId),
      engagement: this.engagementInsightsService.getDepartmentEngagement(departmentId),
    };
  }

  @Post('performance/ai-analyze')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Analisa performance usando IA' })
  async analyzePerformanceWithAI(
    @Body() context: PerformanceContext,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    return this.aiService.generateResponse('Analise a performance do colaborador', context, {
      detailLevel,
    });
  }

  @Post('career/ai-recommendations')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Gera recomendações de carreira usando IA' })
  async getCareerRecommendations(
    @Body() context: CareerContext,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    return this.aiService.generateResponse('Forneça recomendações de carreira', context, {
      detailLevel,
    });
  }

  @Post('skills/ai-assessment')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Avalia habilidades usando IA' })
  async assessSkillsWithAI(
    @Body() context: SkillsContext,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    return this.aiService.generateResponse('Avalie as habilidades do colaborador', context, {
      detailLevel,
    });
  }

  @Post('engagement/ai-predict')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Prevê engajamento usando IA' })
  async predictEngagement(
    @Body() context: EngagementContext,
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    return this.aiService.generateResponse('Preveja o engajamento futuro', context, {
      detailLevel,
    });
  }

  @Post('dashboard/ai-analysis')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Análise completa do dashboard usando IA' })
  async analyzeDashboard(
    @Body()
    contexts: {
      performance: PerformanceContext;
      career: CareerContext;
      skills: SkillsContext;
      engagement: EngagementContext;
    },
    @Query('detailLevel') detailLevel?: 'basic' | 'detailed' | 'technical',
  ) {
    const analysis = await Promise.all([
      this.aiService.generateResponse('Analise performance', contexts.performance, { detailLevel }),
      this.aiService.generateResponse('Analise carreira', contexts.career, { detailLevel }),
      this.aiService.generateResponse('Analise habilidades', contexts.skills, { detailLevel }),
      this.aiService.generateResponse('Analise engajamento', contexts.engagement, { detailLevel }),
    ]);

    return {
      performance: analysis[0],
      career: analysis[1],
      skills: analysis[2],
      engagement: analysis[3],
      timestamp: new Date(),
      detailLevel,
    };
  }
}
