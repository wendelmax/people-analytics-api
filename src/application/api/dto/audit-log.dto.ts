import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AuditAction } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty()
  @IsString()
  entity: string;

  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  oldValue?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  newValue?: Record<string, unknown>;
}

export class UpdateAuditLogDto extends PartialType(CreateAuditLogDto) {}
