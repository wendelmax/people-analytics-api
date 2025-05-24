import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
