import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { GoalStatus } from '@prisma/client';

@ObjectType()
export class Goal {
  @Field(() => ID)
  id: string;

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

  @Field(() => [ID])
  metricIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
