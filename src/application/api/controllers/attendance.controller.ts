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
import { AttendanceService } from '@core/domain/services/attendance.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  CheckInDto,
  CheckOutDto,
  CreateWorkScheduleDto,
  UpdateWorkScheduleDto,
} from '@application/api/dto/attendance.dto';
import { HttpJwtPayload } from '@application/api/auth/type/auth.types';

@ApiTags('attendance')
@Controller('attendance')
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance created successfully' })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.createAttendance(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List attendance records' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findAllAttendances(employeeId, startDate, endDate);
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get attendance by ID' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findAttendanceById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update attendance record' })
  update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendanceService.updateAttendance(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attendance record' })
  delete(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(id);
  }

  @Post('check-in')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Check in for the day' })
  checkIn(@Body() dto: CheckInDto, @UserDecorator() user: HttpJwtPayload) {
    return this.attendanceService.checkIn(user.id, dto);
  }

  @Post('check-out')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Check out for the day' })
  checkOut(@Body() dto: CheckOutDto, @UserDecorator() user: HttpJwtPayload) {
    return this.attendanceService.checkOut(user.id, dto);
  }

  @Get('summary/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get attendance summary' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getSummary(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getAttendanceSummary(employeeId, startDate, endDate);
  }

  @Post('work-schedules')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create work schedule' })
  createWorkSchedule(@Body() dto: CreateWorkScheduleDto) {
    return this.attendanceService.createWorkSchedule(dto);
  }

  @Get('work-schedules')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List work schedules' })
  findAllWorkSchedules() {
    return this.attendanceService.findAllWorkSchedules();
  }

  @Get('work-schedules/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get work schedule by ID' })
  findWorkScheduleById(@Param('id') id: string) {
    return this.attendanceService.findWorkScheduleById(id);
  }

  @Patch('work-schedules/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update work schedule' })
  updateWorkSchedule(@Param('id') id: string, @Body() dto: UpdateWorkScheduleDto) {
    return this.attendanceService.updateWorkSchedule(id, dto);
  }

  @Delete('work-schedules/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete work schedule' })
  deleteWorkSchedule(@Param('id') id: string) {
    return this.attendanceService.deleteWorkSchedule(id);
  }
}
