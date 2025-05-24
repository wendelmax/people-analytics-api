import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Project } from '../types/project.type';
import { ProjectService } from '@core/domain/services/project.service';
import { CreateProjectInput } from '../inputs/create-project.input';
import { UpdateProjectInput } from '../inputs/update-project.input';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project])
  async projects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Query(() => Project)
  async project(@Args('id', { type: () => ID }) id: string): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Mutation(() => Project)
  async createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ): Promise<Project> {
    return this.projectService.create(createProjectInput);
  }

  @Mutation(() => Project)
  async updateProject(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ): Promise<Project> {
    return this.projectService.update(id, updateProjectInput);
  }

  @Mutation(() => Project)
  async deleteProject(@Args('id', { type: () => ID }) id: string): Promise<Project> {
    return this.projectService.delete(id);
  }
}
