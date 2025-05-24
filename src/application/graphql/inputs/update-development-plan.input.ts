import { InputType, Field, ID } from '@nestjs/graphql';
import { DevelopmentPlanStatus } from '@prisma/client';

@InputType()
export class UpdateDevelopmentPlanInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => String, { nullable: true })
  status?: DevelopmentPlanStatus;

  @Field(() => [ID], { nullable: true })
  skillIds?: string[];

  @Field(() => [ID], { nullable: true })
  trainingIds?: string[];
}
