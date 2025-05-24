import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Mentoring } from '../types/mentoring.type';
import { MentoringService } from '@core/domain/services/mentoring.service';
import { CreateMentoringInput } from '../inputs/create-mentoring.input';
import { UpdateMentoringInput } from '../inputs/update-mentoring.input';

@Resolver(() => Mentoring)
export class MentoringResolver {
  constructor(private readonly mentoringService: MentoringService) {}

  @Query(() => [Mentoring])
  async mentorings(): Promise<Mentoring[]> {
    return this.mentoringService.findAll();
  }

  @Query(() => Mentoring)
  async mentoring(@Args('id', { type: () => ID }) id: string): Promise<Mentoring> {
    return this.mentoringService.findById(id);
  }

  @Query(() => [Mentoring])
  async mentorMentorings(
    @Args('mentorId', { type: () => ID }) mentorId: string,
  ): Promise<Mentoring[]> {
    return this.mentoringService.findByMentorId(mentorId);
  }

  @Query(() => [Mentoring])
  async menteeMentorings(
    @Args('menteeId', { type: () => ID }) menteeId: string,
  ): Promise<Mentoring[]> {
    return this.mentoringService.findByMenteeId(menteeId);
  }

  @Mutation(() => Mentoring)
  async createMentoring(
    @Args('createMentoringInput') createMentoringInput: CreateMentoringInput,
  ): Promise<Mentoring> {
    return this.mentoringService.create(createMentoringInput);
  }

  @Mutation(() => Mentoring)
  async updateMentoring(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateMentoringInput') updateMentoringInput: UpdateMentoringInput,
  ): Promise<Mentoring> {
    return this.mentoringService.update(id, updateMentoringInput);
  }

  @Mutation(() => Mentoring)
  async deleteMentoring(@Args('id', { type: () => ID }) id: string): Promise<Mentoring> {
    return this.mentoringService.delete(id);
  }
}
