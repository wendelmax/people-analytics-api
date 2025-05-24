import { Module } from '@nestjs/common';
import { SkillsController } from '@application/api/controller/SkillsController';
import { SkillsService } from '@application/api/service/SkillsService';
import { SkillsRepository } from '@infrastructure/repository/SkillsRepository';
import { CompetenciesController } from '@application/api/controller/CompetenciesController';
import { CompetenciesService } from '@application/api/service/CompetenciesService';
import { CompetenciesRepository } from '@infrastructure/repository/CompetenciesRepository';
import { ProjectSkillsController } from '@application/api/controller/ProjectSkillsController';
import { ProjectSkillsService } from '@application/api/service/ProjectSkillsService';
import { ProjectSkillsRepository } from '@infrastructure/repository/ProjectSkillsRepository';
import { SkillResolver } from '@application/api/graphql/resolvers/skill.resolver';

@Module({
  controllers: [SkillsController, CompetenciesController, ProjectSkillsController],
  providers: [
    SkillsService,
    CompetenciesService,
    ProjectSkillsService,
    SkillResolver,
    {
      provide: 'SkillsRepository',
      useClass: SkillsRepository,
    },
    {
      provide: 'CompetenciesRepository',
      useClass: CompetenciesRepository,
    },
    {
      provide: 'ProjectSkillsRepository',
      useClass: ProjectSkillsRepository,
    },
  ],
  exports: [SkillsService, CompetenciesService, ProjectSkillsService],
})
export class SkillsModule {}
