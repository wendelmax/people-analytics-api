import { Injectable } from '@nestjs/common';
import {
  AnalyticsService,
  AnalyticsOverview,
  EmployeeAnalyticsSnapshot,
  PerformanceTrendPoint,
} from './analytics.service';
import {
  PerformanceInsightsService,
  PerformanceSummary,
  DepartmentInsight,
  EmployeeInsight,
} from './performance-insights.service';
import { CareerService, CareerOverviewModel } from './career.service';

@Injectable()
export class InsightsService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly performanceInsightsService: PerformanceInsightsService,
    private readonly careerService: CareerService,
  ) {}

  async getDashboard(departmentId?: string): Promise<InsightsDashboardModel> {
    const [overview, performanceSummary, performanceTrend, departmentInsights] = await Promise.all([
      this.analyticsService.getOverview(),
      this.performanceInsightsService.getSummary(),
      this.analyticsService.getPerformanceTrend(),
      this.performanceInsightsService.getDepartmentInsights(),
    ]);

    const departmentPerformance = departmentId
      ? (departmentInsights.find((item) => item.departmentId === departmentId) ?? null)
      : null;

    return {
      overview,
      performanceSummary,
      performanceTrend,
      departmentPerformance,
    };
  }

  async getEmployeeInsights(employeeId: string): Promise<EmployeeInsightsModel> {
    const [analyticsSnapshot, performanceInsight, careerOverview] = await Promise.all([
      this.analyticsService.getEmployeeSnapshot(employeeId),
      this.performanceInsightsService.getEmployeeInsight(employeeId),
      this.careerService.getEmployeeOverview(employeeId),
    ]);

    return {
      analyticsSnapshot,
      performanceInsight,
      careerOverview,
    };
  }

  async getDepartmentPerformance(departmentId: string): Promise<DepartmentInsight | null> {
    const insights = await this.performanceInsightsService.getDepartmentInsights();
    return insights.find((item) => item.departmentId === departmentId) ?? null;
  }

  async getPerformanceTrend(): Promise<PerformanceTrendPoint[]> {
    return this.analyticsService.getPerformanceTrend();
  }
}

export type InsightsDashboardModel = {
  overview: AnalyticsOverview;
  performanceSummary: PerformanceSummary;
  performanceTrend: PerformanceTrendPoint[];
  departmentPerformance: DepartmentInsight | null;
};

export type EmployeeInsightsModel = {
  analyticsSnapshot: EmployeeAnalyticsSnapshot;
  performanceInsight: EmployeeInsight;
  careerOverview: CareerOverviewModel;
};
