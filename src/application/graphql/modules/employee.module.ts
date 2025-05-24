import { Module } from '@nestjs/common';
import { EmployeeResolver } from '../resolvers/employee.resolver';
import { EmployeeService } from '@core/domain/services/employee.service';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { PositionService } from '@core/domain/services/position.service';
import { DepartmentService } from '@core/domain/services/department.service';
import { SkillService } from '@core/domain/services/skill.service';
import { PositionResolver } from '../resolvers/position.resolver';
import { DepartmentResolver } from '../resolvers/department.resolver';
import { SkillResolver } from '../resolvers/skill.resolver';
import { EmployeeSkillService } from '@core/domain/services/employee-skill.service';
import { EmployeeSkillResolver } from '../resolvers/employee-skill.resolver';
import { RecommendationService } from '@core/domain/services/recommendation.service';
import { RecommendationResolver } from '../resolvers/recommendation.resolver';
import { CompetencyAssessmentService } from '@core/domain/services/competency-assessment.service';
import { CompetencyAssessmentResolver } from '../resolvers/competency-assessment.resolver';
import { EmployeeJourneyService } from '@core/domain/services/employee-journey.service';
import { EmployeeJourneyResolver } from '../resolvers/employee-journey.resolver';

@Module({
  providers: [
    EmployeeResolver,
    EmployeeService,
    PositionResolver,
    PositionService,
    DepartmentResolver,
    DepartmentService,
    SkillResolver,
    SkillService,
    EmployeeSkillResolver,
    EmployeeSkillService,
    RecommendationResolver,
    RecommendationService,
    CompetencyAssessmentResolver,
    CompetencyAssessmentService,
    EmployeeJourneyResolver,
    EmployeeJourneyService,
    PrismaService,
  ],
})
export class EmployeeModule {}
