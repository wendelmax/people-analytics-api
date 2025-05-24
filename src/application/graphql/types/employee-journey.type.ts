import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EmployeeJourneyStatus } from '@prisma/client';

@ObjectType()
export class EmployeeJourney {
  @Field(() => ID)
  id: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
