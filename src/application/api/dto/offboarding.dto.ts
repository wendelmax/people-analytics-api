import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OffboardingStatus } from '@prisma/client';

export class OffboardingTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ISO deadline date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'ISO completion date' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}

export class CreateOffboardingDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: OffboardingStatus })
  @IsEnum(OffboardingStatus)
  status: OffboardingStatus;

  @ApiPropertyOptional({ description: 'ISO exit date' })
  @IsOptional()
  @IsDateString()
  exitDate?: string;

  @ApiPropertyOptional({ description: 'ISO completion date' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional({ type: [OffboardingTaskDto] })
  @IsOptional()
  @IsArray()
  tasks?: OffboardingTaskDto[];
}

export class UpdateOffboardingDto extends PartialType(CreateOffboardingDto) {}
