import { Module } from '@nestjs/common';
import { EmployeeController } from '@application/api/controllers/employee.controller';
import { DepartmentsController } from '@application/api/controllers/departments.controller';
import { PositionsController } from '@application/api/controllers/positions.controller';
import { SkillsController } from '@application/api/controllers/skills.controller';
import { ProjectsController } from '@application/api/controllers/projects.controller';
import { TrainingController } from '@application/api/controllers/training.controller';
import { FeedbackController } from '@application/api/controllers/feedback.controller';
import { RecommendationsController } from '@application/api/controllers/recommendations.controller';
import { MentoringController } from '@application/api/controllers/mentoring.controller';
import { GoalController } from '@application/api/controllers/goal.controller';
import { DevelopmentController } from '@application/api/controllers/development.controller';
import { PerformanceController } from '@application/api/controllers/performance.controller';
import { NotificationsController } from '@application/api/controllers/notifications.controller';
import { AuditLogController } from '@application/api/controllers/audit-log.controller';
import { AnalyticsController } from '@application/api/controllers/analytics.controller';
import { PerformanceInsightsController } from '@application/api/controllers/performance-insights.controller';
import { InsightsController } from '@application/api/controllers/insights.controller';
import { CareerPathwayController } from '@application/api/controllers/career-pathway.controller';
import { OnboardingController } from '@application/api/controllers/onboarding.controller';
import { OffboardingController } from '@application/api/controllers/offboarding.controller';
import { EmployeeJourneyController } from '@application/api/controllers/employee-journey.controller';
import { CareerController } from '@application/api/controllers/career.controller';
import { KnowledgeBaseController } from '@application/api/controllers/knowledge-base.controller';
import { CompetencyAssessmentController } from '@application/api/controllers/competency-assessment.controller';
import { ServicesModule } from '@core/domain/services/services.module';
import { ProjectSkillsController } from '@application/api/controllers/project-skills.controller';
import { SkillProficiencyController } from '@application/api/controllers/skill-proficiency.controller';
import { AdminController } from '@application/api/controllers/admin.controller';
import { AuthController } from '@application/api/controllers/auth.controller';
import { LeaveController } from '@application/api/controllers/leave.controller';
import { AttendanceController } from '@application/api/controllers/attendance.controller';
import { EmployeeSelfServiceController } from '@application/api/controllers/employee-self-service.controller';

@Module({
  imports: [ServicesModule],
  controllers: [
    AuthController,
    EmployeeController,
    DepartmentsController,
    PositionsController,
    SkillsController,
    ProjectsController,
    TrainingController,
    FeedbackController,
    RecommendationsController,
    MentoringController,
    GoalController,
    DevelopmentController,
    PerformanceController,
    NotificationsController,
    AuditLogController,
    AnalyticsController,
    PerformanceInsightsController,
    OnboardingController,
    OffboardingController,
    CareerPathwayController,
    EmployeeJourneyController,
    CareerController,
    KnowledgeBaseController,
    CompetencyAssessmentController,
    InsightsController,
    ProjectSkillsController,
    SkillProficiencyController,
    AdminController,
    LeaveController,
    AttendanceController,
    EmployeeSelfServiceController,
  ],
})
export class ApiModule {}
