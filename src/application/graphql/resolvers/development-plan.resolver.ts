import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DevelopmentPlan } from '../types/development-plan.type';
import { DevelopmentPlanService } from '@core/domain/services/development-plan.service';
import { CreateDevelopmentPlanInput } from '../inputs/create-development-plan.input';
import { UpdateDevelopmentPlanInput } from '../inputs/update-development-plan.input';

@Resolver(() => DevelopmentPlan)
export class DevelopmentPlanResolver {
  constructor(private readonly developmentPlanService: DevelopmentPlanService) {}

  @Query(() => [DevelopmentPlan])
  async developmentPlans(): Promise<DevelopmentPlan[]> {
    return this.developmentPlanService.findAll();
  }

  @Query(() => DevelopmentPlan)
  async developmentPlan(@Args('id', { type: () => ID }) id: string): Promise<DevelopmentPlan> {
    return this.developmentPlanService.findById(id);
  }

  @Query(() => [DevelopmentPlan])
  async employeeDevelopmentPlans(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<DevelopmentPlan[]> {
    return this.developmentPlanService.findByEmployeeId(employeeId);
  }

  @Mutation(() => DevelopmentPlan)
  async createDevelopmentPlan(
    @Args('createDevelopmentPlanInput') createDevelopmentPlanInput: CreateDevelopmentPlanInput,
  ): Promise<DevelopmentPlan> {
    return this.developmentPlanService.create(createDevelopmentPlanInput);
  }

  @Mutation(() => DevelopmentPlan)
  async updateDevelopmentPlan(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateDevelopmentPlanInput') updateDevelopmentPlanInput: UpdateDevelopmentPlanInput,
  ): Promise<DevelopmentPlan> {
    return this.developmentPlanService.update(id, updateDevelopmentPlanInput);
  }

  @Mutation(() => DevelopmentPlan)
  async deleteDevelopmentPlan(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DevelopmentPlan> {
    return this.developmentPlanService.delete(id);
  }
}
