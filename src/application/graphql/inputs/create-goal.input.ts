import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { GoalStatus } from '@prisma/client';

@InputType()
export class CreateGoalInput {
  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  startDate: Date;

  @Field()
  targetDate: Date;

  @Field(() => String)
  status: GoalStatus;

  @Field(() => Float)
  weight: number;
}
