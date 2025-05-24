import { InputType, Field, ID } from '@nestjs/graphql';
import { SentimentType } from '@prisma/client';

@InputType()
export class CreateFeedbackInput {
  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  touchpointId: string;

  @Field()
  comment: string;

  @Field(() => String)
  sentiment: SentimentType;
}
