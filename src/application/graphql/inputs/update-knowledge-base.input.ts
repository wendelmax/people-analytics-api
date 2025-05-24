import { InputType, Field, ID } from '@nestjs/graphql';
import { KnowledgeBaseCategory } from '@prisma/client';

@InputType()
export class UpdateKnowledgeBaseInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => String, { nullable: true })
  category?: KnowledgeBaseCategory;

  @Field(() => [ID], { nullable: true })
  skillIds?: string[];
}
