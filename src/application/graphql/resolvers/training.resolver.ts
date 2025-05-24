import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Training } from '../types/training.type';
import { TrainingService } from '@core/domain/services/training.service';
import { CreateTrainingInput } from '../inputs/create-training.input';
import { UpdateTrainingInput } from '../inputs/update-training.input';

@Resolver(() => Training)
export class TrainingResolver {
  constructor(private readonly trainingService: TrainingService) {}

  @Query(() => [Training])
  async trainings(): Promise<Training[]> {
    return this.trainingService.findAll();
  }

  @Query(() => Training)
  async training(@Args('id', { type: () => ID }) id: string): Promise<Training> {
    return this.trainingService.findById(id);
  }

  @Query(() => [Training])
  async employeeTrainings(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<Training[]> {
    return this.trainingService.findByEmployeeId(employeeId);
  }

  @Mutation(() => Training)
  async createTraining(
    @Args('createTrainingInput') createTrainingInput: CreateTrainingInput,
  ): Promise<Training> {
    return this.trainingService.create(createTrainingInput);
  }

  @Mutation(() => Training)
  async updateTraining(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTrainingInput') updateTrainingInput: UpdateTrainingInput,
  ): Promise<Training> {
    return this.trainingService.update(id, updateTrainingInput);
  }

  @Mutation(() => Training)
  async deleteTraining(@Args('id', { type: () => ID }) id: string): Promise<Training> {
    return this.trainingService.delete(id);
  }
}
