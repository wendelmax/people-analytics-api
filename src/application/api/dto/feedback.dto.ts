import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { FeedbackType, SentimentType } from '@prisma/client';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsUUID()
  authorId: string;

  @ApiProperty()
  @IsUUID()
  recipientId: string;

  @ApiProperty({ enum: FeedbackType })
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @ApiProperty({ enum: SentimentType })
  @IsEnum(SentimentType)
  sentiment: SentimentType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}
