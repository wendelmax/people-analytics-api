import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    findAll() {
        return this.notificationsService.findAll();
    }

    @Post()
    create(@Body() notificationData: any) {
        return this.notificationsService.create(notificationData);
    }

    @Put(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(+id);
    }
}
