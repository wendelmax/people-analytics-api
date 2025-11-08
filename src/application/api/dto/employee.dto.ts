import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, IsEmail, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsDateString()
  hireDate: string;

  @ApiProperty()
  @IsUUID()
  departmentId: string;

  @ApiProperty()
  @IsUUID()
  positionId: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  skillIds?: string[];
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
