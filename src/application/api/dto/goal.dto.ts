import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { GoalPriority, GoalStatus, GoalType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateGoalDto {
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

  @ApiProperty({ enum: GoalType })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty({ enum: GoalPriority })
  @IsEnum(GoalPriority)
  priority: GoalPriority;

  @ApiProperty({ enum: GoalStatus })
  @IsEnum(GoalStatus)
  status: GoalStatus;

  @ApiProperty({ type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: String })
  @IsDateString()
  targetDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  progress?: number;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}
