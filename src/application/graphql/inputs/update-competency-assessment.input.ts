import { InputType, Field, ID } from '@nestjs/graphql';
import { CompetencyAssessmentStatus } from '@prisma/client';

@InputType()
export class UpdateCompetencyAssessmentInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  assessmentDate?: Date;

  @Field(() => String, { nullable: true })
  status?: CompetencyAssessmentStatus;

  @Field(() => [ID], { nullable: true })
  skillIds?: string[];
}
