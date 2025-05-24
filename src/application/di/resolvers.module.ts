import { Module } from '@nestjs/common';
import { EmployeeResolver } from '@application/graphql/resolvers/employee.resolver';
import { DepartmentResolver } from '@application/graphql/resolvers/department.resolver';
import { PositionResolver } from '@application/graphql/resolvers/position.resolver';
import { SkillResolver } from '@application/graphql/resolvers/skill.resolver';
import { ProjectResolver } from '@application/graphql/resolvers/project.resolver';
import { TrainingResolver } from '@application/graphql/resolvers/training.resolver';
import { PerformanceResolver } from '@application/graphql/resolvers/performance.resolver';
import { MentoringResolver } from '@application/graphql/resolvers/mentoring.resolver';
import { ServicesModule } from '@core/domain/services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [
    EmployeeResolver,
    DepartmentResolver,
    PositionResolver,
    SkillResolver,
    ProjectResolver,
    TrainingResolver,
    PerformanceResolver,
    MentoringResolver,
  ],
})
export class ResolversModule {}
