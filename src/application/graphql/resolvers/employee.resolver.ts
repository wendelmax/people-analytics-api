import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Employee } from '../types/employee.type';
import { EmployeeService } from '@core/domain/services/employee.service';
import { CreateEmployeeInput } from '../inputs/create-employee.input';
import { UpdateEmployeeInput } from '../inputs/update-employee.input';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Query(() => [Employee])
  async employees(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Query(() => Employee)
  async employee(@Args('id', { type: () => ID }) id: string): Promise<Employee> {
    return this.employeeService.findById(id);
  }

  @Mutation(() => Employee)
  async createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
  ): Promise<Employee> {
    return this.employeeService.create(createEmployeeInput);
  }

  @Mutation(() => Employee)
  async updateEmployee(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
  ): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeInput);
  }

  @Mutation(() => Employee)
  async deleteEmployee(@Args('id', { type: () => ID }) id: string): Promise<Employee> {
    return this.employeeService.delete(id);
  }
}
