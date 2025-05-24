import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Career } from '../types/career.type';
import { CareerService } from '@core/domain/services/career.service';
import { CreateCareerInput } from '../inputs/create-career.input';
import { UpdateCareerInput } from '../inputs/update-career.input';

@Resolver(() => Career)
export class CareerResolver {
  constructor(private readonly careerService: CareerService) {}

  @Query(() => [Career])
  async careers(): Promise<Career[]> {
    return this.careerService.findAll();
  }

  @Query(() => Career)
  async career(@Args('id', { type: () => ID }) id: string): Promise<Career> {
    return this.careerService.findById(id);
  }

  @Mutation(() => Career)
  async createCareer(
    @Args('createCareerInput') createCareerInput: CreateCareerInput,
  ): Promise<Career> {
    return this.careerService.create(createCareerInput);
  }

  @Mutation(() => Career)
  async updateCareer(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCareerInput') updateCareerInput: UpdateCareerInput,
  ): Promise<Career> {
    return this.careerService.update(id, updateCareerInput);
  }

  @Mutation(() => Career)
  async deleteCareer(@Args('id', { type: () => ID }) id: string): Promise<Career> {
    return this.careerService.delete(id);
  }
}
