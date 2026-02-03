import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { RecommendationSource, RecommendationPriority, RecommendationStatus } from '@prisma/client';

@InputType()
export class CreateRecommendationInput {
  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => String)
  type: RecommendationSource;

  @Field(() => Int)
  priority: RecommendationPriority;

  @Field(() => String)
  status: RecommendationStatus;

  @Field(() => [ID])
  skillIds: string[];
}
