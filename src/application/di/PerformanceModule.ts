import { Module } from '@nestjs/common';
import { PerformanceController } from '@application/api/controller/PerformanceController';
import { PerformanceService } from '@application/api/service/PerformanceService';
import { PerformanceRepository } from '@infrastructure/repository/PerformanceRepository';
import { GoalsController } from '@application/api/controller/GoalsController';
import { GoalsService } from '@application/api/service/GoalsService';
import { GoalsRepository } from '@infrastructure/repository/GoalsRepository';
import { PerformanceInsightsController } from '@application/api/controller/PerformanceInsightsController';
import { PerformanceInsightsService } from '@application/api/service/PerformanceInsightsService';
import { PerformanceInsightsRepository } from '@infrastructure/repository/PerformanceInsightsRepository';
import { PerformanceResolver } from '@application/graphql/resolvers/performance.resolver';

@Module({
  controllers: [PerformanceController, GoalsController, PerformanceInsightsController],
  providers: [
    PerformanceService,
    GoalsService,
    PerformanceInsightsService,
    PerformanceResolver,
    {
      provide: 'PerformanceRepository',
      useClass: PerformanceRepository,
    },
    {
      provide: 'GoalsRepository',
      useClass: GoalsRepository,
    },
    {
      provide: 'PerformanceInsightsRepository',
      useClass: PerformanceInsightsRepository,
    },
  ],
  exports: [PerformanceService, GoalsService, PerformanceInsightsService],
})
export class PerformanceModule {}
