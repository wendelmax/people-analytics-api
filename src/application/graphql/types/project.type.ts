import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Employee } from './employee.type';
import { Skill } from './skill.type';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  status: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => [Employee])
  team: Employee[];

  @Field(() => [Skill])
  requiredSkills: Skill[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
