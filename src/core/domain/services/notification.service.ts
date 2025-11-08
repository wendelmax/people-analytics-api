import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  CreateNotificationPreferenceDto,
  UpdateNotificationPreferenceDto,
} from '@application/api/dto/notification.dto';
import { NotificationChannel, NotificationStatus, Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<NotificationModel[]> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map((notification) => this.mapNotification(notification));
  }

  async findById(id: string): Promise<NotificationModel> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.mapNotification(notification);
  }

  async findByEmployee(employeeId: string): Promise<NotificationModel[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map((notification) => this.mapNotification(notification));
  }

  async create(data: CreateNotificationDto): Promise<NotificationModel> {
    const notification = await this.prisma.notification.create({
      data: {
        employeeId: data.employeeId,
        channel: data.channel,
        status: data.status,
        title: data.title,
        message: data.message,
        metadata: (data.metadata ?? undefined) as Prisma.InputJsonValue,
        sentAt: data.sentAt ? new Date(data.sentAt) : undefined,
        readAt: data.readAt ? new Date(data.readAt) : undefined,
      },
    });

    return this.mapNotification(notification);
  }

  async update(id: string, data: UpdateNotificationDto): Promise<NotificationModel> {
    await this.ensureNotificationExists(id);

    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        channel: data.channel,
        status: data.status,
        title: data.title,
        message: data.message,
        metadata: (data.metadata ?? undefined) as Prisma.InputJsonValue,
        sentAt: data.sentAt ? new Date(data.sentAt) : undefined,
        readAt: data.readAt ? new Date(data.readAt) : undefined,
      },
    });

    return this.mapNotification(notification);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureNotificationExists(id);
    await this.prisma.notification.delete({ where: { id } });
    return true;
  }

  async upsertPreference(
    data: CreateNotificationPreferenceDto | UpdateNotificationPreferenceDto,
  ): Promise<NotificationPreferenceModel> {
    const preference = await this.prisma.notificationPreference.upsert({
      where: {
        employeeId_channel: {
          employeeId: data.employeeId,
          channel: data.channel,
        },
      },
      update: {
        enabled: data.enabled,
      },
      create: {
        employeeId: data.employeeId,
        channel: data.channel,
        enabled: data.enabled ?? true,
      },
    });

    return this.mapPreference(preference);
  }

  async getPreferences(employeeId: string): Promise<NotificationPreferenceModel[]> {
    const preferences = await this.prisma.notificationPreference.findMany({
      where: { employeeId },
    });

    return preferences.map((preference) => this.mapPreference(preference));
  }

  private async ensureNotificationExists(id: string): Promise<void> {
    const exists = await this.prisma.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  private mapNotification(notification: NotificationPayload): NotificationModel {
    return {
      id: notification.id,
      employeeId: notification.employeeId,
      channel: notification.channel,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      metadata: notification.metadata ?? undefined,
      sentAt: notification.sentAt ?? undefined,
      readAt: notification.readAt ?? undefined,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  private mapPreference(preference: NotificationPreferenceRecord): NotificationPreferenceModel {
    return {
      id: preference.id,
      employeeId: preference.employeeId,
      channel: preference.channel,
      enabled: preference.enabled,
      createdAt: preference.createdAt,
      updatedAt: preference.updatedAt,
    };
  }
}

type NotificationPayload = {
  id: string;
  employeeId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  message: string;
  metadata: Prisma.JsonValue | null;
  sentAt: Date | null;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type NotificationPreferenceRecord = {
  id: string;
  employeeId: string;
  channel: NotificationChannel;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationModel = {
  id: string;
  employeeId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  message: string;
  metadata?: Prisma.JsonValue;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationPreferenceModel = {
  id: string;
  employeeId: string;
  channel: NotificationChannel;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
