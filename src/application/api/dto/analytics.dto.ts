import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class AnalyticsRangeDto {
  @ApiPropertyOptional({ description: 'ISO start date for analytics calculations' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'ISO end date for analytics calculations' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
