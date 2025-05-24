import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Career {
  @Field(() => ID)
  id: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
