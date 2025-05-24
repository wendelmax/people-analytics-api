import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Feedback } from '../types/feedback.type';
import { FeedbackService } from '@core/domain/services/feedback.service';
import { CreateFeedbackInput } from '../inputs/create-feedback.input';
import { UpdateFeedbackInput } from '../inputs/update-feedback.input';

@Resolver(() => Feedback)
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Query(() => [Feedback])
  async feedbacks(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Query(() => Feedback)
  async feedback(@Args('id', { type: () => ID }) id: string): Promise<Feedback> {
    return this.feedbackService.findById(id);
  }

  @Query(() => [Feedback])
  async employeeFeedbacks(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<Feedback[]> {
    return this.feedbackService.findByEmployeeId(employeeId);
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Args('createFeedbackInput') createFeedbackInput: CreateFeedbackInput,
  ): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackInput);
  }

  @Mutation(() => Feedback)
  async updateFeedback(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateFeedbackInput') updateFeedbackInput: UpdateFeedbackInput,
  ): Promise<Feedback> {
    return this.feedbackService.update(id, updateFeedbackInput);
  }

  @Mutation(() => Feedback)
  async deleteFeedback(@Args('id', { type: () => ID }) id: string): Promise<Feedback> {
    return this.feedbackService.delete(id);
  }
}
