import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SkillCategory, SkillLevel, SkillType } from '@prisma/client';

export class CreateSkillDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: SkillType })
  @IsEnum(SkillType)
  type: SkillType;

  @ApiProperty({ enum: SkillCategory })
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @ApiProperty({ required: false, enum: SkillLevel })
  @IsOptional()
  @IsEnum(SkillLevel)
  defaultLevel?: SkillLevel;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
