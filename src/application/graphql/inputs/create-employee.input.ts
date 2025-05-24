import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEmployeeInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  position: string;

  @Field()
  department: string;
}
