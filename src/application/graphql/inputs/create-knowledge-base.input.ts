import { InputType, Field, ID } from '@nestjs/graphql';
import { KnowledgeBaseCategory } from '@prisma/client';

@InputType()
export class CreateKnowledgeBaseInput {
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
}
