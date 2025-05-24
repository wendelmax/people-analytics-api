import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCareerInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  level: string;

  @Field()
  requirements: string;

  @Field()
  salaryRange: string;
}
