import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { InsightsService } from '@core/domain/services/insights.service';

@ApiTags('insights')
@Controller('insights')
@ApiBearerAuth()
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all insights' })
  findAll() {
    return this.insightsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get insight by ID' })
  findOne(@Param('id') id: string) {
    return this.insightsService.findById(id);
  }

  @Get('performance-insights/employee/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get performance insights for an employee' })
  @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
  getEmployeePerformanceInsights(@Param('employeeId') employeeId: string) {
    return this.insightsService.getEmployeeInsights(employeeId);
  }

  @Get('performance-insights/team/:teamId')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR)
  @ApiOperation({ summary: 'Get performance insights for a team' })
  @ApiParam({ name: 'teamId', description: 'ID do time' })
  getTeamPerformanceInsights(@Param('teamId') teamId: string) {
    return this.insightsService.getTeamInsights(teamId);
  }

  @Get('performance-insights/department/:departmentId')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER, UserRole.HR_DIRECTOR)
  @ApiOperation({ summary: 'Get performance insights for a department' })
  @ApiParam({ name: 'departmentId', description: 'ID do departamento' })
  getDepartmentPerformanceInsights(@Param('departmentId') departmentId: string) {
    return this.insightsService.getDepartmentPerformance(departmentId);
  }
}
