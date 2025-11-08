import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class ProjectTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budget?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  skillIds?: string[];

  @ApiProperty({ required: false, type: [ProjectTeamMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectTeamMemberDto)
  team?: ProjectTeamMemberDto[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
