import { Module } from '@nestjs/common';
import { InsightsController } from '@application/api/controllers/insights.controller';
import { AIService } from '@core/common/services/AIService';
import { PerformanceInsightsService } from '@core/domain/performance-insights/service/PerformanceInsightsService';
import { CareerInsightsService } from '@core/domain/career-insights/service/CareerInsightsService';
import { SkillsInsightsService } from '@core/domain/skills-insights/service/SkillsInsightsService';
import { EngagementInsightsService } from '@core/domain/engagement-insights/service/EngagementInsightsService';
import { PerformanceInsightsRepository } from '@core/domain/performance-insights/repository/PerformanceInsightsRepository';
import { CareerInsightsRepository } from '@core/domain/career-insights/repository/CareerInsightsRepository';
import { SkillsInsightsRepository } from '@core/domain/skills-insights/repository/SkillsInsightsRepository';
import { EngagementInsightsRepository } from '@core/domain/engagement-insights/repository/EngagementInsightsRepository';
import { PrismaService } from '@database/prisma/prisma.service';

@Module({
  controllers: [InsightsController],
  providers: [
    AIService,
    PerformanceInsightsService,
    CareerInsightsService,
    SkillsInsightsService,
    EngagementInsightsService,
    {
      provide: 'PerformanceInsightsRepository',
      useClass: PerformanceInsightsRepository,
    },
    {
      provide: 'CareerInsightsRepository',
      useClass: CareerInsightsRepository,
    },
    {
      provide: 'SkillsInsightsRepository',
      useClass: SkillsInsightsRepository,
    },
    {
      provide: 'EngagementInsightsRepository',
      useClass: EngagementInsightsRepository,
    },
    PrismaService,
  ],
  exports: [
    AIService,
    PerformanceInsightsService,
    CareerInsightsService,
    SkillsInsightsService,
    EngagementInsightsService,
  ],
})
export class InsightsModule {}
