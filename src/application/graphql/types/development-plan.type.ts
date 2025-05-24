import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DevelopmentPlanStatus } from '@prisma/client';

@ObjectType()
export class DevelopmentPlan {
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
  endDate: Date;

  @Field(() => String)
  status: DevelopmentPlanStatus;

  @Field(() => [ID])
  skillIds: string[];

  @Field(() => [ID])
  trainingIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
