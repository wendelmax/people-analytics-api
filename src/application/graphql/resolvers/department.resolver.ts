import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Department } from '../types/department.type';
import { DepartmentService } from '@core/domain/services/department.service';
import { CreateDepartmentInput } from '../inputs/create-department.input';
import { UpdateDepartmentInput } from '../inputs/update-department.input';

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  @Query(() => [Department])
  async departments(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Query(() => Department)
  async department(@Args('id', { type: () => ID }) id: string): Promise<Department> {
    return this.departmentService.findById(id);
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args('createDepartmentInput') createDepartmentInput: CreateDepartmentInput,
  ): Promise<Department> {
    return this.departmentService.create(createDepartmentInput);
  }

  @Mutation(() => Department)
  async updateDepartment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateDepartmentInput') updateDepartmentInput: UpdateDepartmentInput,
  ): Promise<Department> {
    return this.departmentService.update(id, updateDepartmentInput);
  }

  @Mutation(() => Department)
  async deleteDepartment(@Args('id', { type: () => ID }) id: string): Promise<Department> {
    return this.departmentService.delete(id);
  }
}
