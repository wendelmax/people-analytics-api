import { Module } from '@nestjs/common';
import { ProjectsController } from '@application/api/controller/ProjectsController';
import { ProjectService } from '@application/api/service/ProjectService';
import { ProjectRepository } from '@infrastructure/repository/ProjectRepository';
import { ProjectResolver } from '@application/api/graphql/resolvers/project.resolver';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectService,
    ProjectResolver,
    {
      provide: 'ProjectRepository',
      useClass: ProjectRepository,
    },
  ],
  exports: [ProjectService],
})
export class ProjectsModule {}
