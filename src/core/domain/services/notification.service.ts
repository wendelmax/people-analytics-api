import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateNotificationInput } from '@application/graphql/inputs/create-notification.input';
import { UpdateNotificationInput } from '@application/graphql/inputs/update-notification.input';
import { Notification } from '@application/graphql/types/notification.type';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Notification[]> {
    const result = await this.prisma.notification.findMany({
      include: {
        employee: true,
      },
    });

    return result.map((notification) => ({
      id: notification.id.toString(),
      employeeId: notification.employeeId.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));
  }

  async findById(id: string): Promise<Notification> {
    const result = await this.prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      message: result.message,
      type: result.type,
      read: result.read,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Notification[]> {
    const result = await this.prisma.notification.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        employee: true,
      },
    });

    return result.map((notification) => ({
      id: notification.id.toString(),
      employeeId: notification.employeeId.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));
  }

  async create(data: CreateNotificationInput): Promise<Notification> {
    const result = await this.prisma.notification.create({
      data: {
        employeeId: parseInt(data.employeeId),
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
      },
      include: {
        employee: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      message: result.message,
      type: result.type,
      read: result.read,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: UpdateNotificationInput): Promise<Notification> {
    const result = await this.prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
      },
      include: {
        employee: true,
      },
    });

    return {
      id: result.id.toString(),
      employeeId: result.employeeId.toString(),
      title: result.title,
      message: result.message,
      type: result.type,
      read: result.read,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.findById(id);
    await this.prisma.notification.delete({
      where: { id: parseInt(id) },
    });
    return { success: true };
  }
}
