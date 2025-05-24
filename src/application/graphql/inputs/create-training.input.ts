import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateTrainingInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  type: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => [ID])
  participantIds: string[];

  @Field(() => [ID])
  skillIds: string[];

  @Field()
  status: string;
}
