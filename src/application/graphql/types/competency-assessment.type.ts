import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CompetencyAssessmentStatus } from '@prisma/client';

@ObjectType()
export class CompetencyAssessment {
  @Field(() => ID)
  id: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
