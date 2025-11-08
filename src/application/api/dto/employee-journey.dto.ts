import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { EmployeeJourneyStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEmployeeJourneyDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  positionId?: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: EmployeeJourneyStatus })
  @IsEnum(EmployeeJourneyStatus)
  status: EmployeeJourneyStatus;

  @ApiProperty({ description: 'ISO start date' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ description: 'ISO end date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class UpdateEmployeeJourneyDto extends PartialType(CreateEmployeeJourneyDto) {}

export class CreateJourneyTouchpointDto {
  @ApiProperty()
  @IsUUID()
  journeyId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ISO timestamp' })
  @IsDateString()
  occurredAt: string;
}

export class UpdateJourneyTouchpointDto extends PartialType(CreateJourneyTouchpointDto) {}
