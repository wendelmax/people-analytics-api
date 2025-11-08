import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsObject,
} from 'class-validator';
import { NotificationChannel, NotificationStatus } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ enum: NotificationStatus })
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  readAt?: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}

export class CreateNotificationPreferenceDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateNotificationPreferenceDto extends PartialType(CreateNotificationPreferenceDto) {}
