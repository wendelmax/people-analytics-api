import { InputType, Field, Float } from '@nestjs/graphql';
import { GoalStatus } from '@prisma/client';

@InputType()
export class UpdateGoalInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  targetDate?: Date;

  @Field(() => String, { nullable: true })
  status?: GoalStatus;

  @Field(() => Float, { nullable: true })
  weight?: number;
}
