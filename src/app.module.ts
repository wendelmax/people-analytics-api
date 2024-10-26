import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CareerModule } from './career/career.module';
import { EmployeesModule } from './employees/employees.module';
import { OrganizationalStructureModule } from './organizational-structure/organizational-structure.module';
import { SkillsModule } from './skills/skills.module';
import { EmployeeJourneyModule } from './employee-journey/employee-journey.module';
import { FeedbackModule } from './feedback/feedback.module';
import { DevelopmentModule } from './development/development.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatbotInteractionsModule } from './chatbot-interactions/chatbot-interactions.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CareerModule,
    EmployeesModule,
    OrganizationalStructureModule,
    SkillsModule,
    EmployeeJourneyModule,
    FeedbackModule,
    DevelopmentModule,
    NotificationsModule,
    ChatbotInteractionsModule,
    RecommendationsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
