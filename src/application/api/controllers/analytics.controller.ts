import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AnalyticsService } from '@core/domain/services/analytics.service';
import { AnalyticsRangeDto } from '@application/api/dto/analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get overall analytics overview' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get analytics snapshot for employee' })
  @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
  getEmployeeSnapshot(@Param('employeeId') employeeId: string) {
    return this.analyticsService.getEmployeeSnapshot(employeeId);
  }

  @Get('performance-trend')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get performance review trend within a date range' })
  getPerformanceTrend(@Query() range: AnalyticsRangeDto) {
    return this.analyticsService.getPerformanceTrend(range);
  }
}
