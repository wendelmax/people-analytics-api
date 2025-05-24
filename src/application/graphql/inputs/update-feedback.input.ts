import { InputType, Field } from '@nestjs/graphql';
import { SentimentType } from '@prisma/client';

@InputType()
export class UpdateFeedbackInput {
  @Field({ nullable: true })
  comment?: string;

  @Field(() => String, { nullable: true })
  sentiment?: SentimentType;
}
