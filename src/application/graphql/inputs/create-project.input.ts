import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
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

  @Field(() => [ID])
  teamIds: string[];

  @Field(() => [ID])
  requiredSkillIds: string[];
}
