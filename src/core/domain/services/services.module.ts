import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { EmployeeService } from './employee.service';
import { DepartmentService } from './department.service';
import { PositionService } from './position.service';
import { SkillService } from './skill.service';
import { ProjectService } from './project.service';
import { TrainingService } from './training.service';
import { FeedbackService } from './feedback.service';
import { RecommendationService } from './recommendation.service';
import { MentoringService } from './mentoring.service';
import { GoalService } from './goal.service';
import { DevelopmentPlanService } from './development-plan.service';
import { PerformanceService } from './performance.service';
import { NotificationService } from './notification.service';
import { AuditLogService } from './audit-log.service';
import { AnalyticsService } from './analytics.service';
import { PerformanceInsightsService } from './performance-insights.service';
import { OnboardingService } from './onboarding.service';
import { OffboardingService } from './offboarding.service';
import { CareerPathService } from './career-path.service';
import { EmployeeJourneyService } from './employee-journey.service';
import { CareerService } from './career.service';
import { OrganizationalStructureService } from './organizational-structure.service';
import { KnowledgeBaseService } from './knowledge-base.service';
import { CompetencyAssessmentService } from './competency-assessment.service';
import { InsightsService } from './insights.service';
import { ProjectSkillsService } from './project-skills.service';
import { SkillProficiencyService } from './skill-proficiency.service';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule],
  providers: [
    EmployeeService,
    DepartmentService,
    PositionService,
    SkillService,
    ProjectService,
    TrainingService,
    FeedbackService,
    RecommendationService,
    MentoringService,
    GoalService,
    DevelopmentPlanService,
    PerformanceService,
    NotificationService,
    AuditLogService,
    AnalyticsService,
    PerformanceInsightsService,
    OnboardingService,
    OffboardingService,
    CareerPathService,
    EmployeeJourneyService,
    CareerService,
    OrganizationalStructureService,
    KnowledgeBaseService,
    CompetencyAssessmentService,
    InsightsService,
    ProjectSkillsService,
    SkillProficiencyService,
    AdminService,
  ],
  exports: [
    EmployeeService,
    DepartmentService,
    PositionService,
    SkillService,
    ProjectService,
    TrainingService,
    FeedbackService,
    RecommendationService,
    MentoringService,
    GoalService,
    DevelopmentPlanService,
    PerformanceService,
    NotificationService,
    AuditLogService,
    AnalyticsService,
    PerformanceInsightsService,
    OnboardingService,
    OffboardingService,
    CareerPathService,
    EmployeeJourneyService,
    CareerService,
    OrganizationalStructureService,
    KnowledgeBaseService,
    CompetencyAssessmentService,
    InsightsService,
    ProjectSkillsService,
    SkillProficiencyService,
    AdminService,
  ],
})
export class ServicesModule {}
