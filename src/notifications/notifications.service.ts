import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Notification[]> {
        return this.prisma.notification.findMany();
    }

    async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
        return this.prisma.notification.create({ data });
    }

    async markAsRead(id: number): Promise<Notification> {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
}
