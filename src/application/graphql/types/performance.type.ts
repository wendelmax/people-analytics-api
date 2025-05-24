import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Employee } from './employee.type';

@ObjectType()
export class Performance {
  @Field(() => ID)
  id: string;

  @Field(() => Employee)
  employee: Employee;

  @Field()
  period: string;

  @Field()
  rating: number;

  @Field()
  goals: string;

  @Field()
  achievements: string;

  @Field()
  feedback: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
