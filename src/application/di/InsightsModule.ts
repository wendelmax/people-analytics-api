import { Module } from '@nestjs/common';
import { InsightsController } from '@application/api/controllers/insights.controller';
import { AIService } from '@core/domain/service/ai.service';
import { PerformanceInsightsService } from '@core/domain/services/performance-insights.service';
import { PrismaModule } from '@infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InsightsController],
  providers: [AIService, PerformanceInsightsService],
  exports: [AIService, PerformanceInsightsService],
})
export class InsightsModule {}
