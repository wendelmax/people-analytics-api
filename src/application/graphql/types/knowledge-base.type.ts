import { ObjectType, Field, ID } from '@nestjs/graphql';
import { KnowledgeBaseCategory } from '@prisma/client';

@ObjectType()
export class KnowledgeBase {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => String)
  category: KnowledgeBaseCategory;

  @Field(() => [ID])
  skillIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
