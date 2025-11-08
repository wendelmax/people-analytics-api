import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateAuditLogDto, UpdateAuditLogDto } from '@application/api/dto/audit-log.dto';
import { AuditAction, Prisma } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AuditLogModel[]> {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((log) => this.mapToModel(log));
  }

  async findById(id: string): Promise<AuditLogModel> {
    const log = await this.prisma.auditLog.findUnique({ where: { id } });

    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return this.mapToModel(log);
  }

  async findByUser(userId: string): Promise<AuditLogModel[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((log) => this.mapToModel(log));
  }

  async create(data: CreateAuditLogDto): Promise<AuditLogModel> {
    const log = await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        oldValue: data.oldValue as Prisma.InputJsonValue,
        newValue: data.newValue as Prisma.InputJsonValue,
      },
    });

    return this.mapToModel(log);
  }

  async update(id: string, data: UpdateAuditLogDto): Promise<AuditLogModel> {
    await this.ensureExists(id);

    const log = await this.prisma.auditLog.update({
      where: { id },
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        oldValue: data.oldValue as Prisma.InputJsonValue,
        newValue: data.newValue as Prisma.InputJsonValue,
      },
    });

    return this.mapToModel(log);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    await this.prisma.auditLog.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.auditLog.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
  }

  private mapToModel(log: AuditLogRecord): AuditLogModel {
    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      oldValue: log.oldValue ?? undefined,
      newValue: log.newValue ?? undefined,
      createdAt: log.createdAt,
    };
  }
}

type AuditLogRecord = {
  id: string;
  userId: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  oldValue: Prisma.JsonValue | null;
  newValue: Prisma.JsonValue | null;
  createdAt: Date;
};

export type AuditLogModel = {
  id: string;
  userId: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  oldValue?: Prisma.JsonValue;
  newValue?: Prisma.JsonValue;
  createdAt: Date;
};
