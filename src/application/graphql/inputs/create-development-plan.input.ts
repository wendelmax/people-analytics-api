import { InputType, Field, ID } from '@nestjs/graphql';
import { DevelopmentPlanStatus } from '@prisma/client';

@InputType()
export class CreateDevelopmentPlanInput {
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
}
