import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { PerformanceInsightsService } from '@core/domain/services/performance-insights.service';
import { PerformanceInsightQueryDto } from '@application/api/dto/performance-insight.dto';

@ApiTags('performance-insights')
@Controller('performance-insights')
@ApiBearerAuth()
export class PerformanceInsightsController {
  constructor(private readonly performanceInsightsService: PerformanceInsightsService) {}

  @Get('summary')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get performance summary across organization' })
  getSummary(@Query() query: PerformanceInsightQueryDto) {
    return this.performanceInsightsService.getSummary(query);
  }

  @Get('departments')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get performance insights by department' })
  getDepartments(@Query() query: PerformanceInsightQueryDto) {
    return this.performanceInsightsService.getDepartmentInsights(query);
  }

  @Get('positions')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get performance insights by position' })
  getPositions(@Query() query: PerformanceInsightQueryDto) {
    return this.performanceInsightsService.getPositionInsights(query);
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get performance insights for an employee' })
  getEmployee(@Param('employeeId') employeeId: string) {
    return this.performanceInsightsService.getEmployeeInsight(employeeId);
  }
}
