import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillLevel } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class TrackSkillProgressDto {
  @ApiProperty({ enum: SkillLevel })
  @IsEnum(SkillLevel)
  proficiencyLevel: SkillLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  evidence?: string;
}
