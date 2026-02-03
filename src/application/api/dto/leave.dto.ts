import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateLeaveTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxDays?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  carryForward?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
}

export class UpdateLeaveTypeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  carryForward?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateLeaveRequestDto {
  @ApiProperty()
  @IsUUID()
  leaveTypeId: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ApproveLeaveRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectLeaveRequestDto {
  @ApiProperty()
  @IsString()
  rejectedReason: string;
}

export class CreateLeavePolicyDto {
  @ApiProperty()
  @IsUUID()
  leaveTypeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  positionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  accrualRate?: number;
}

export class UpdateLeavePolicyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  accrualRate?: number;
}
