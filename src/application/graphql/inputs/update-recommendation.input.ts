import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { RecommendationType, RecommendationPriority, RecommendationStatus } from '@prisma/client';

@InputType()
export class UpdateRecommendationInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  type?: RecommendationType;

  @Field(() => Int, { nullable: true })
  priority?: RecommendationPriority;

  @Field(() => String, { nullable: true })
  status?: RecommendationStatus;

  @Field(() => [ID], { nullable: true })
  skillIds?: string[];
}
