import { InputType, Field, ID } from '@nestjs/graphql';
import { EmployeeJourneyStatus } from '@prisma/client';

@InputType()
export class UpdateEmployeeJourneyInput {
  @Field(() => ID, { nullable: true })
  positionId?: string;

  @Field(() => ID, { nullable: true })
  departmentId?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => String, { nullable: true })
  status?: EmployeeJourneyStatus;
}
