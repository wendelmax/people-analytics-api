import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AssessmentPeriodStatus, CompetencyAssessmentStatus } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateAssessmentPeriodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ISO start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'ISO end date' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: AssessmentPeriodStatus })
  @IsOptional()
  @IsEnum(AssessmentPeriodStatus)
  status?: AssessmentPeriodStatus;
}

export class UpdateAssessmentPeriodDto extends PartialType(CreateAssessmentPeriodDto) {}

export class UpdateAssessmentPeriodStatusDto {
  @ApiProperty({ enum: AssessmentPeriodStatus })
  @IsEnum(AssessmentPeriodStatus)
  status: AssessmentPeriodStatus;
}

export class CompetencySkillRatingDto {
  @ApiProperty()
  @IsUUID()
  skillId: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}

export class CreateCompetencyAssessmentDto {
  @ApiProperty()
  @IsUUID()
  periodId: string;

  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @ApiProperty({ enum: CompetencyAssessmentStatus })
  @IsEnum(CompetencyAssessmentStatus)
  status: CompetencyAssessmentStatus;

  @ApiPropertyOptional({ minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  overallScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ type: [CompetencySkillRatingDto] })
  @IsOptional()
  @IsArray()
  skillRatings?: CompetencySkillRatingDto[];
}

export class UpdateCompetencyAssessmentDto extends PartialType(CreateCompetencyAssessmentDto) {}
