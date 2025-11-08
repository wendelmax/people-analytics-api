import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { KnowledgeCategory } from '@prisma/client';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateKnowledgeArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: KnowledgeCategory })
  @IsEnum(KnowledgeCategory)
  category: KnowledgeCategory;

  @ApiProperty()
  @IsUUID()
  authorId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  skillIds?: string[];

  @ApiPropertyOptional({ description: 'ISO publish date' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}

export class UpdateKnowledgeArticleDto extends PartialType(CreateKnowledgeArticleDto) {}

export class KnowledgeArticleQueryDto {
  @ApiPropertyOptional({ enum: KnowledgeCategory })
  @IsOptional()
  @IsEnum(KnowledgeCategory)
  category?: KnowledgeCategory;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
