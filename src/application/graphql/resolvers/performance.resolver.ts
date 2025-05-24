import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Performance } from '../types/performance.type';
import { PerformanceService } from '@core/domain/services/performance.service';
import { CreatePerformanceInput } from '../inputs/create-performance.input';
import { UpdatePerformanceInput } from '../inputs/update-performance.input';

@Resolver(() => Performance)
export class PerformanceResolver {
  constructor(private readonly performanceService: PerformanceService) {}

  @Query(() => [Performance])
  async performances(): Promise<Performance[]> {
    return this.performanceService.findAll();
  }

  @Query(() => Performance)
  async performance(@Args('id', { type: () => ID }) id: string): Promise<Performance> {
    return this.performanceService.findById(id);
  }

  @Query(() => [Performance])
  async employeePerformances(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<Performance[]> {
    return this.performanceService.findByEmployeeId(employeeId);
  }

  @Mutation(() => Performance)
  async createPerformance(
    @Args('createPerformanceInput') createPerformanceInput: CreatePerformanceInput,
  ): Promise<Performance> {
    return this.performanceService.create(createPerformanceInput);
  }

  @Mutation(() => Performance)
  async updatePerformance(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePerformanceInput') updatePerformanceInput: UpdatePerformanceInput,
  ): Promise<Performance> {
    return this.performanceService.update(id, updatePerformanceInput);
  }

  @Mutation(() => Performance)
  async deletePerformance(@Args('id', { type: () => ID }) id: string): Promise<Performance> {
    return this.performanceService.delete(id);
  }
}
