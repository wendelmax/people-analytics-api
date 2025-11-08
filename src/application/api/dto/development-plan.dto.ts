import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { DevelopmentPlanStatus, DevelopmentItemStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class DevelopmentPlanItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DevelopmentItemStatus })
  @IsEnum(DevelopmentItemStatus)
  status: DevelopmentItemStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  skillId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class CreateDevelopmentPlanDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DevelopmentPlanStatus })
  @IsEnum(DevelopmentPlanStatus)
  status: DevelopmentPlanStatus;

  @ApiProperty({ type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: String })
  @IsDateString()
  targetDate: string;

  @ApiProperty({ required: false, type: [DevelopmentPlanItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentPlanItemDto)
  items?: DevelopmentPlanItemDto[];
}

export class UpdateDevelopmentPlanDto extends PartialType(CreateDevelopmentPlanDto) {}
