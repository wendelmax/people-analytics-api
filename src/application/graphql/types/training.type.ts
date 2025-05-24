import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Employee } from './employee.type';
import { Skill } from './skill.type';

@ObjectType()
export class Training {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  type: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => [Employee])
  participants: Employee[];

  @Field(() => [Skill])
  skills: Skill[];

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
