import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TrainingStatus, TrainingType } from '@prisma/client';
import { Type } from 'class-transformer';

export class TrainingParticipantDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: TrainingStatus })
  @IsEnum(TrainingStatus)
  status: TrainingStatus;

  @ApiProperty({ type: String })
  @IsDateString()
  startedAt: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}

export class CreateTrainingDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({ enum: TrainingType })
  @IsEnum(TrainingType)
  type: TrainingType;

  @ApiProperty({ enum: TrainingStatus })
  @IsEnum(TrainingStatus)
  status: TrainingStatus;

  @ApiProperty({ type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  skillIds?: string[];

  @ApiProperty({ required: false, type: [TrainingParticipantDto] })
  @IsOptional()
  @IsArray()
  @Type(() => TrainingParticipantDto)
  participants?: TrainingParticipantDto[];
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {}
