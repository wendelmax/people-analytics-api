import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SentimentType } from '@prisma/client';

@ObjectType()
export class Feedback {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  touchpointId: string;

  @Field()
  comment: string;

  @Field(() => String)
  sentiment: SentimentType;

  @Field()
  feedbackDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
