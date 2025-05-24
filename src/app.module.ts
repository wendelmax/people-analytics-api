import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from '@infrastructure/database/prisma.module';
import { CareerModule } from '@application/di/CareerModule';
import { EmployeeModule } from '@application/di/EmployeeModule';
import { SkillsModule } from '@application/di/SkillsModule';
import { DevelopmentModule } from '@application/di/DevelopmentModule';
import { ProjectsModule } from '@application/di/ProjectsModule';
import { PerformanceModule } from '@application/di/PerformanceModule';
import { MentoringModule } from '@application/di/MentoringModule';
import { KnowledgeBaseModule } from '@application/di/KnowledgeBaseModule';
import { RecommendationsModule } from '@application/di/RecommendationsModule';
import { NotificationsModule } from '@application/di/NotificationsModule';
import { ChatbotInteractionsModule } from '@application/di/ChatbotInteractionsModule';
import { EmployeeJourneyModule } from '@application/di/EmployeeJourneyModule';
import { OrganizationalStructureModule } from '@application/di/OrganizationalStructureModule';
import { FeedbackModule } from '@application/di/FeedbackModule';
import { RecognitionModule } from '@application/di/RecognitionModule';
import { AuthModule } from './core/domain/auth/auth.module';
import { join } from 'path';
import { ResolversModule } from './application/di/resolvers.module';
import { AppGraphQLModule } from './application/di/graphql.module';
import { PeopleAnalyticsModule } from './modules/people-analytics/people-analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PrismaModule,
    CareerModule,
    EmployeeModule,
    SkillsModule,
    DevelopmentModule,
    ProjectsModule,
    PerformanceModule,
    MentoringModule,
    KnowledgeBaseModule,
    RecommendationsModule,
    NotificationsModule,
    ChatbotInteractionsModule,
    EmployeeJourneyModule,
    OrganizationalStructureModule,
    FeedbackModule,
    RecognitionModule,
    AuthModule,
    ResolversModule,
    AppGraphQLModule,
    PeopleAnalyticsModule,
  ],
})
export class AppModule {}
