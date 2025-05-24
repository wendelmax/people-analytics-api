import { Module } from '@nestjs/common';
import { NotificationsController } from '@application/api/controller/NotificationsController';
import { NotificationsService } from '@application/api/service/NotificationsService';
import { NotificationsRepository } from '@infrastructure/repository/NotificationsRepository';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: 'NotificationsRepository',
      useClass: NotificationsRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
