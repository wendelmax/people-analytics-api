import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePerformanceInput {
  @Field(() => ID)
  employeeId: string;

  @Field()
  period: string;

  @Field()
  rating: number;

  @Field()
  goals: string;

  @Field()
  achievements: string;

  @Field()
  feedback: string;
}
