import { InputType, Field } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

@InputType()
export class UpdateNotificationInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  type?: NotificationType;

  @Field({ nullable: true })
  read?: boolean;
}
