import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSkillInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  category: string;

  @Field()
  level: string;

  @Field(() => [String])
  tags: string[];
}
