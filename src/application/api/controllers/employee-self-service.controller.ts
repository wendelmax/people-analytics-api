import { Controller, Get, Patch, Query, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserDecorator } from '@application/api/auth/decorator/user.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { EmployeeService } from '@core/domain/services/employee.service';
import { LeaveService } from '@core/domain/services/leave.service';
import { AttendanceService } from '@core/domain/services/attendance.service';
import { GoalService } from '@core/domain/services/goal.service';
import { TrainingService } from '@core/domain/services/training.service';
import { PerformanceService } from '@core/domain/services/performance.service';
import { UpdateEmployeeDto } from '@application/api/dto/employee.dto';
import { HttpJwtPayload } from '@application/api/auth/type/auth.types';

@ApiTags('employee-self-service')
@Controller('employee/me')
@ApiBearerAuth()
export class EmployeeSelfServiceController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly leaveService: LeaveService,
    private readonly attendanceService: AttendanceService,
    private readonly goalService: GoalService,
    private readonly trainingService: TrainingService,
    private readonly performanceService: PerformanceService,
  ) {}

  @Get('profile')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get my profile' })
  getMyProfile(@UserDecorator() user: HttpJwtPayload) {
    return this.employeeService.findById(user.id);
  }

  @Patch('profile')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Update my profile' })
  updateMyProfile(@UserDecorator() user: HttpJwtPayload, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(user.id, dto);
  }

  @Get('leaves')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my leave requests' })
  @ApiQuery({ name: 'status', required: false })
  getMyLeaves(@UserDecorator() user: HttpJwtPayload, @Query('status') status?: string) {
    return this.leaveService.findAllLeaveRequests(user.id, status as any);
  }

  @Get('leave-balances')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my leave balances' })
  @ApiQuery({ name: 'year', required: false })
  getMyLeaveBalances(@UserDecorator() user: HttpJwtPayload, @Query('year') year?: number) {
    return this.leaveService.getEmployeeLeaveBalances(user.id, year);
  }

  @Get('attendance')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my attendance records' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getMyAttendance(
    @UserDecorator() user: HttpJwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findAllAttendances(user.id, startDate, endDate);
  }

  @Get('attendance/summary')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my attendance summary' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getMyAttendanceSummary(
    @UserDecorator() user: HttpJwtPayload,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getAttendanceSummary(user.id, startDate, endDate);
  }

  @Get('goals')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my goals' })
  getMyGoals(@UserDecorator() user: HttpJwtPayload) {
    return this.goalService
      .findAll()
      .then((goals) => goals.filter((g: any) => g.employeeId === user.id));
  }

  @Get('trainings')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my trainings' })
  getMyTrainings(@UserDecorator() user: HttpJwtPayload) {
    return this.trainingService
      .findAll()
      .then((trainings) => trainings.filter((t: any) => t.participants?.includes(user.id)));
  }

  @Get('performance-reviews')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my performance reviews' })
  getMyPerformanceReviews(@UserDecorator() user: HttpJwtPayload) {
    return this.performanceService
      .findAll()
      .then((reviews) => reviews.filter((r: any) => r.employeeId === user.id));
  }

  @Get('dashboard')
  @AuthDecorator(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get my dashboard data' })
  async getMyDashboard(@UserDecorator() user: HttpJwtPayload) {
    const [profile, leaveBalances, recentAttendance, goals, trainings, performanceReviews] =
      await Promise.all([
        this.employeeService.findById(user.id),
        this.leaveService.getEmployeeLeaveBalances(user.id),
        this.attendanceService
          .findAllAttendances(user.id, undefined, undefined)
          .then((att) => att.slice(0, 7)),
        this.goalService
          .findAll()
          .then((goals) => goals.filter((g: any) => g.employeeId === user.id)),
        this.trainingService
          .findAll()
          .then((trainings) => trainings.filter((t: any) => t.participants?.includes(user.id))),
        this.performanceService
          .findAll()
          .then((reviews) => reviews.filter((r: any) => r.employeeId === user.id).slice(0, 5)),
      ]);

    return {
      profile,
      leaveBalances,
      recentAttendance,
      goals: goals.slice(0, 5),
      trainings: trainings.slice(0, 5),
      performanceReviews,
    };
  }
}
