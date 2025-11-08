import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PerformanceReviewStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePerformanceReviewDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsUUID()
  reviewerId: string;

  @ApiProperty({ type: String })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ type: String })
  @IsDateString()
  periodEnd: string;

  @ApiProperty({ enum: PerformanceReviewStatus })
  @IsEnum(PerformanceReviewStatus)
  status: PerformanceReviewStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  overallRating?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  improvements?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}

export class UpdatePerformanceReviewDto extends PartialType(CreatePerformanceReviewDto) {}
