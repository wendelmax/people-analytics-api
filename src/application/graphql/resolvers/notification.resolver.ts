import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Notification } from '../types/notification.type';
import { NotificationService } from '@core/domain/services/notification.service';
import { CreateNotificationInput } from '../inputs/create-notification.input';
import { UpdateNotificationInput } from '../inputs/update-notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification])
  async notifications(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Query(() => Notification)
  async notification(@Args('id', { type: () => ID }) id: string): Promise<Notification> {
    return this.notificationService.findById(id);
  }

  @Query(() => [Notification])
  async employeeNotifications(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<Notification[]> {
    return this.notificationService.findByEmployeeId(employeeId);
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args('createNotificationInput') createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    return this.notificationService.create(createNotificationInput);
  }

  @Mutation(() => Notification)
  async updateNotification(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    return this.notificationService.update(id, updateNotificationInput);
  }

  @Mutation(() => Notification)
  async deleteNotification(@Args('id', { type: () => ID }) id: string): Promise<Notification> {
    return this.notificationService.delete(id);
  }
}
