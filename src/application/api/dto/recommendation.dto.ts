import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { RecommendationPriority, RecommendationSource, RecommendationStatus } from '@prisma/client';

export class CreateRecommendationDto {
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

  @ApiProperty({ enum: RecommendationSource })
  @IsEnum(RecommendationSource)
  source: RecommendationSource;

  @ApiProperty({ enum: RecommendationPriority })
  @IsEnum(RecommendationPriority)
  priority: RecommendationPriority;

  @ApiProperty({ enum: RecommendationStatus })
  @IsEnum(RecommendationStatus)
  status: RecommendationStatus;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  skillIds?: string[];
}

export class UpdateRecommendationDto extends PartialType(CreateRecommendationDto) {}
