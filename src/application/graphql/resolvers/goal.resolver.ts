import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Goal } from '../types/goal.type';
import { GoalService } from '@core/domain/services/goal.service';
import { CreateGoalInput } from '../inputs/create-goal.input';
import { UpdateGoalInput } from '../inputs/update-goal.input';

@Resolver(() => Goal)
export class GoalResolver {
  constructor(private readonly goalService: GoalService) {}

  @Query(() => [Goal])
  async goals(): Promise<Goal[]> {
    return this.goalService.findAll();
  }

  @Query(() => Goal)
  async goal(@Args('id', { type: () => ID }) id: string): Promise<Goal> {
    return this.goalService.findById(id);
  }

  @Query(() => [Goal])
  async employeeGoals(@Args('employeeId', { type: () => ID }) employeeId: string): Promise<Goal[]> {
    return this.goalService.findByEmployeeId(employeeId);
  }

  @Mutation(() => Goal)
  async createGoal(@Args('createGoalInput') createGoalInput: CreateGoalInput): Promise<Goal> {
    return this.goalService.create(createGoalInput);
  }

  @Mutation(() => Goal)
  async updateGoal(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateGoalInput') updateGoalInput: UpdateGoalInput,
  ): Promise<Goal> {
    return this.goalService.update(id, updateGoalInput);
  }

  @Mutation(() => Goal)
  async deleteGoal(@Args('id', { type: () => ID }) id: string): Promise<Goal> {
    return this.goalService.delete(id);
  }
}
