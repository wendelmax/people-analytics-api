import { InputType, Field, ID } from '@nestjs/graphql';
import { CompetencyAssessmentStatus } from '@prisma/client';

@InputType()
export class CreateCompetencyAssessmentInput {
  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  assessmentDate: Date;

  @Field(() => String)
  status: CompetencyAssessmentStatus;

  @Field(() => [ID])
  skillIds: string[];
}
