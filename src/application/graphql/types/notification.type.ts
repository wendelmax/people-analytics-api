import { ObjectType, Field, ID } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  employeeId: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => String)
  type: NotificationType;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
