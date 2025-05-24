import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateMentoringInput {
  @Field(() => ID)
  mentorId: string;

  @Field(() => ID)
  menteeId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  status: string;

  @Field()
  goals: string;

  @Field()
  focus: string;
}
