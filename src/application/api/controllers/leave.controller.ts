import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserDecorator } from '@application/api/auth/decorator/user.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { LeaveService } from '@core/domain/services/leave.service';
import {
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
} from '@application/api/dto/leave.dto';
import { LeaveStatus } from '@prisma/client';
import { HttpJwtPayload } from '@application/api/auth/type/auth.types';

@ApiTags('leaves')
@Controller('leaves')
@ApiBearerAuth()
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('types')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create leave type' })
  @ApiResponse({ status: 201, description: 'Leave type created successfully' })
  createLeaveType(@Body() dto: CreateLeaveTypeDto) {
    return this.leaveService.createLeaveType(dto);
  }

  @Get('types')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all leave types' })
  findAllLeaveTypes() {
    return this.leaveService.findAllLeaveTypes();
  }

  @Get('types/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get leave type by ID' })
  findLeaveTypeById(@Param('id') id: string) {
    return this.leaveService.findLeaveTypeById(id);
  }

  @Patch('types/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update leave type' })
  updateLeaveType(@Param('id') id: string, @Body() dto: UpdateLeaveTypeDto) {
    return this.leaveService.updateLeaveType(id, dto);
  }

  @Delete('types/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete leave type' })
  deleteLeaveType(@Param('id') id: string) {
    return this.leaveService.deleteLeaveType(id);
  }

  @Post('requests')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create leave request' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully' })
  createLeaveRequest(@Body() dto: CreateLeaveRequestDto, @UserDecorator() user: HttpJwtPayload) {
    return this.leaveService.createLeaveRequest(user.id, dto);
  }

  @Get('requests')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List leave requests' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: LeaveStatus })
  findAllLeaveRequests(
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: LeaveStatus,
  ) {
    return this.leaveService.findAllLeaveRequests(employeeId, status);
  }

  @Get('requests/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get leave request by ID' })
  findLeaveRequestById(@Param('id') id: string) {
    return this.leaveService.findLeaveRequestById(id);
  }

  @Patch('requests/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update leave request' })
  updateLeaveRequest(@Param('id') id: string, @Body() dto: UpdateLeaveRequestDto) {
    return this.leaveService.updateLeaveRequest(id, dto);
  }

  @Post('requests/:id/approve')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Approve leave request' })
  approveLeaveRequest(
    @Param('id') id: string,
    @Body() dto: ApproveLeaveRequestDto,
    @UserDecorator() user: HttpJwtPayload,
  ) {
    return this.leaveService.approveLeaveRequest(id, user.id, dto);
  }

  @Post('requests/:id/reject')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Reject leave request' })
  rejectLeaveRequest(
    @Param('id') id: string,
    @Body() dto: RejectLeaveRequestDto,
    @UserDecorator() user: HttpJwtPayload,
  ) {
    return this.leaveService.rejectLeaveRequest(id, user.id, dto);
  }

  @Post('requests/:id/cancel')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Cancel leave request' })
  cancelLeaveRequest(@Param('id') id: string, @UserDecorator() user: HttpJwtPayload) {
    return this.leaveService.cancelLeaveRequest(id, user.id);
  }

  @Get('balances/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get employee leave balances' })
  @ApiQuery({ name: 'year', required: false })
  getEmployeeLeaveBalances(@Param('employeeId') employeeId: string, @Query('year') year?: number) {
    return this.leaveService.getEmployeeLeaveBalances(employeeId, year);
  }

  @Post('policies')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create leave policy' })
  createLeavePolicy(@Body() dto: CreateLeavePolicyDto) {
    return this.leaveService.createLeavePolicy(dto);
  }

  @Get('policies')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List leave policies' })
  findAllLeavePolicies() {
    return this.leaveService.findAllLeavePolicies();
  }

  @Patch('policies/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update leave policy' })
  updateLeavePolicy(@Param('id') id: string, @Body() dto: UpdateLeavePolicyDto) {
    return this.leaveService.updateLeavePolicy(id, dto);
  }

  @Delete('policies/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete leave policy' })
  deleteLeavePolicy(@Param('id') id: string) {
    return this.leaveService.deleteLeavePolicy(id);
  }
}
