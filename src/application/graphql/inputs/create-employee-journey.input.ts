import { InputType, Field, ID } from '@nestjs/graphql';
import { EmployeeJourneyStatus } from '@prisma/client';

@InputType()
export class CreateEmployeeJourneyInput {
  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  positionId: string;

  @Field(() => ID)
  departmentId: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => String)
  status: EmployeeJourneyStatus;
}
