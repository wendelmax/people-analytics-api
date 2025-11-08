import { InputType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateEmployeeInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => GraphQLISODateTime)
  hireDate: Date;

  @Field(() => ID)
  departmentId: string;

  @Field(() => ID)
  positionId: string;

  @Field(() => [ID], { nullable: true })
  skillIds?: string[];
}
