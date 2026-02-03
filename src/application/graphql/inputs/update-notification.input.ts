import { InputType, Field } from '@nestjs/graphql';
import { NotificationChannel } from '@prisma/client';

@InputType()
export class UpdateNotificationInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  type?: NotificationChannel;

  @Field({ nullable: true })
  read?: boolean;
}
