import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { MentoringStatus } from '@prisma/client';

export class CreateMentoringDto {
  @ApiProperty()
  @IsUUID()
  mentorId: string;

  @ApiProperty()
  @IsUUID()
  menteeId: string;

  @ApiProperty({ enum: MentoringStatus })
  @IsEnum(MentoringStatus)
  status: MentoringStatus;

  @ApiProperty({ type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMentoringDto extends PartialType(CreateMentoringDto) {}
