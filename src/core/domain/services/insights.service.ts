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
import { randomUUID } from 'crypto';

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

  async findAll(): Promise<InsightModel[]> {
    const [overview, employees] = await Promise.all([
      this.analyticsService.getOverview(),
      this.analyticsService.getTopPerformers(),
    ]);

    const insights: InsightModel[] = [];

    if (overview.averagePerformance < 3.0) {
      insights.push({
        id: randomUUID(),
        title: 'Performance Below Average',
        description: `Average performance is ${overview.averagePerformance.toFixed(2)}, which is below the target threshold.`,
        type: 'RISK',
        priority: 'HIGH',
        createdAt: new Date(),
      });
    }

    employees.slice(0, 5).forEach((employee) => {
      insights.push({
        id: randomUUID(),
        title: `Top Performer: ${employee.name}`,
        description: `${employee.name} is performing exceptionally well.`,
        type: 'PERFORMANCE',
        priority: 'MEDIUM',
        relatedEntityId: employee.id,
        relatedEntityType: 'EMPLOYEE',
        createdAt: new Date(),
      });
    });

    return insights;
  }

  async findById(id: string): Promise<InsightModel> {
    const insights = await this.findAll();
    const insight = insights.find((i) => i.id === id);
    if (!insight) {
      throw new Error(`Insight with ID ${id} not found`);
    }
    return insight;
  }

  async getTeamInsights(teamId: string): Promise<TeamInsightsModel> {
    const departmentInsights = await this.performanceInsightsService.getDepartmentInsights();
    const teamInsight = departmentInsights.find((item) => item.departmentId === teamId);

    if (!teamInsight) {
      throw new Error(`Team with ID ${teamId} not found`);
    }

    return {
      teamId,
      averagePerformance: teamInsight.averageRating,
      totalMembers: teamInsight.employeeCount,
      topPerformers: [],
      areasForImprovement: [],
    };
  }
}

export type InsightModel = {
  id: string;
  title: string;
  description: string;
  type: 'PERFORMANCE' | 'TREND' | 'RISK' | 'OPPORTUNITY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
};

export type TeamInsightsModel = {
  teamId: string;
  averagePerformance: number;
  totalMembers: number;
  topPerformers: any[];
  areasForImprovement: any[];
};

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
