import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Position } from '../types/position.type';
import { PositionService } from '@core/domain/services/position.service';
import { CreatePositionInput } from '../inputs/create-position.input';
import { UpdatePositionInput } from '../inputs/update-position.input';

@Resolver(() => Position)
export class PositionResolver {
  constructor(private readonly positionService: PositionService) {}

  @Query(() => [Position])
  async positions(): Promise<Position[]> {
    return this.positionService.findAll();
  }

  @Query(() => Position)
  async position(@Args('id', { type: () => ID }) id: string): Promise<Position> {
    return this.positionService.findById(id);
  }

  @Mutation(() => Position)
  async createPosition(
    @Args('createPositionInput') createPositionInput: CreatePositionInput,
  ): Promise<Position> {
    return this.positionService.create(createPositionInput);
  }

  @Mutation(() => Position)
  async updatePosition(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePositionInput') updatePositionInput: UpdatePositionInput,
  ): Promise<Position> {
    return this.positionService.update(id, updatePositionInput);
  }

  @Mutation(() => Position)
  async deletePosition(@Args('id', { type: () => ID }) id: string): Promise<Position> {
    return this.positionService.delete(id);
  }
}
