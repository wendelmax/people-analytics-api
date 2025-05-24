import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Employee {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  position: string;

  @Field()
  department: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
