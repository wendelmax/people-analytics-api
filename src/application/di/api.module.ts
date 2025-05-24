import { Module } from '@nestjs/common';

import { CareerController } from '@application/api/controllers/career.controller';
import { EmployeeController } from '@application/api/controllers/employee.controller';
import { SkillsController } from '@application/api/controllers/skills.controller';
import { TrainingController } from '@application/api/controllers/training.controller';
import { ProjectsController } from '@application/api/controllers/projects.controller';
import { PerformanceController } from '@application/api/controllers/performance.controller';
import { MentoringController } from '@application/api/controllers/mentoring.controller';
import { KnowledgeBaseController } from '@application/api/controllers/knowledge-base.controller';
import { RecommendationsController } from '@application/api/controllers/recommendations.controller';
import { PerformanceInsightsController } from '@application/api/controllers/performance-insights.controller';
import { NotificationsController } from '@application/api/controllers/notifications.controller';
import { ChatbotInteractionsController } from '@application/api/controllers/chatbot.controller';
import { ProjectSkillsController } from '@application/api/controllers/project-skills.controller';
import { EmployeeJourneyController } from '@application/api/controllers/employee-journey.controller';
import { OrganizationalStructureController } from '@application/api/controllers/organizational-structure.controller';
import { DevelopmentController } from '@application/api/controllers/development.controller';
import { FeedbackController } from '@application/api/controllers/feedback.controller';

@Module({
  controllers: [
    CareerController,
    EmployeeController,
    SkillsController,
    TrainingController,
    ProjectsController,
    PerformanceController,
    MentoringController,
    KnowledgeBaseController,
    RecommendationsController,
    PerformanceInsightsController,
    NotificationsController,
    ChatbotInteractionsController,
    ProjectSkillsController,
    EmployeeJourneyController,
    OrganizationalStructureController,
    DevelopmentController,
    FeedbackController,
  ],
})
export class ApiModule {}
