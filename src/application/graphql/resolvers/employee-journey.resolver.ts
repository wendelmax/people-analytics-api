import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EmployeeJourney } from '../types/employee-journey.type';
import { EmployeeJourneyService } from '@core/domain/services/employee-journey.service';
import { CreateEmployeeJourneyInput } from '../inputs/create-employee-journey.input';
import { UpdateEmployeeJourneyInput } from '../inputs/update-employee-journey.input';

@Resolver(() => EmployeeJourney)
export class EmployeeJourneyResolver {
  constructor(private readonly employeeJourneyService: EmployeeJourneyService) {}

  @Query(() => [EmployeeJourney])
  async employeeJourneys(): Promise<EmployeeJourney[]> {
    return this.employeeJourneyService.findAll();
  }

  @Query(() => EmployeeJourney)
  async employeeJourney(@Args('id', { type: () => ID }) id: string): Promise<EmployeeJourney> {
    return this.employeeJourneyService.findById(id);
  }

  @Query(() => [EmployeeJourney])
  async employeeJourneysByEmployee(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<EmployeeJourney[]> {
    return this.employeeJourneyService.findByEmployeeId(employeeId);
  }

  @Mutation(() => EmployeeJourney)
  async createEmployeeJourney(
    @Args('createEmployeeJourneyInput') createEmployeeJourneyInput: CreateEmployeeJourneyInput,
  ): Promise<EmployeeJourney> {
    return this.employeeJourneyService.create(createEmployeeJourneyInput);
  }

  @Mutation(() => EmployeeJourney)
  async updateEmployeeJourney(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEmployeeJourneyInput') updateEmployeeJourneyInput: UpdateEmployeeJourneyInput,
  ): Promise<EmployeeJourney> {
    return this.employeeJourneyService.update(id, updateEmployeeJourneyInput);
  }

  @Mutation(() => EmployeeJourney)
  async deleteEmployeeJourney(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<EmployeeJourney> {
    return this.employeeJourneyService.delete(id);
  }
}
