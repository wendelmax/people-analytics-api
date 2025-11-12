import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { InsightsService } from '@core/domain/services/insights.service';

@ApiTags('insights')
@Controller('insights')
@ApiBearerAuth()
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('dashboard')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR)
  @ApiOperation({ summary: 'Get organizational insights dashboard' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'ID do departamento para filtrar' })
  @ApiResponse({ status: 200, description: 'Aggregated dashboard insights' })
  getDashboard(@Query('departmentId') departmentId?: string) {
    return this.insightsService.getDashboard(departmentId);
  }

  @Get('employees/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get consolidated insights for an employee' })
  @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
  @ApiResponse({ status: 200, description: 'Employee insights snapshot' })
  getEmployeeInsights(@Param('employeeId') employeeId: string) {
    return this.insightsService.getEmployeeInsights(employeeId);
  }

  @Get('departments/:departmentId/performance')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR)
  @ApiOperation({ summary: 'Get performance insight for a department' })
  @ApiParam({ name: 'departmentId', description: 'ID do departamento' })
  getDepartmentPerformance(@Param('departmentId') departmentId: string) {
    return this.insightsService.getDepartmentPerformance(departmentId);
  }

  @Get('performance-trend')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR)
  @ApiOperation({ summary: 'Get global performance review trend' })
  getPerformanceTrend() {
    return this.insightsService.getPerformanceTrend();
  }
}
