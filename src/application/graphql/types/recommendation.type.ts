import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RecommendationType, RecommendationPriority, RecommendationStatus } from '@prisma/client';

@ObjectType()
export class Recommendation {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => String)
  type: RecommendationType;

  @Field(() => Int)
  priority: RecommendationPriority;

  @Field(() => String)
  status: RecommendationStatus;

  @Field(() => [ID])
  skillIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
