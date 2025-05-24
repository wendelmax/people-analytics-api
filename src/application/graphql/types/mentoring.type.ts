import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Employee } from './employee.type';

@ObjectType()
export class Mentoring {
  @Field(() => ID)
  id: string;

  @Field(() => Employee)
  mentor: Employee;

  @Field(() => Employee)
  mentee: Employee;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  status: string;

  @Field()
  goals: string;

  @Field()
  progress: string;

  @Field()
  feedback: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
