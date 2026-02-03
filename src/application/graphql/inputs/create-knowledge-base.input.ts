import { InputType, Field, ID } from '@nestjs/graphql';
import { KnowledgeCategory } from '@prisma/client';

@InputType()
export class CreateKnowledgeBaseInput {
  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => String)
  category: KnowledgeCategory;

  @Field(() => [ID])
  skillIds: string[];
}
