import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Employee {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => GraphQLISODateTime)
  hireDate: Date;

  @Field()
  departmentId: string;

  @Field({ nullable: true })
  departmentName?: string | null;

  @Field()
  positionId: string;

  @Field({ nullable: true })
  positionTitle?: string | null;

  @Field(() => [ID])
  skillIds: string[];

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
