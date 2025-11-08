import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OnboardingStatus } from '@prisma/client';

export class OnboardingTaskDto {
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

export class CreateOnboardingDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: OnboardingStatus })
  @IsEnum(OnboardingStatus)
  status: OnboardingStatus;

  @ApiPropertyOptional({ description: 'ISO start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'ISO completion date' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional({ type: [OnboardingTaskDto] })
  @IsOptional()
  @IsArray()
  tasks?: OnboardingTaskDto[];
}

export class UpdateOnboardingDto extends PartialType(CreateOnboardingDto) {}
