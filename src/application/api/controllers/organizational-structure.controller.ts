import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { OrganizationalStructureService } from '@core/domain/services/organizational-structure.service';

@ApiTags('organizational-structure')
@Controller('organizational-structure')
@ApiBearerAuth()
export class OrganizationalStructureController {
  constructor(private readonly organizationalStructureService: OrganizationalStructureService) {}

  @Get('overview')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get organizational structure overview' })
  @ApiResponse({ status: 200, description: 'Organizational structure overview' })
  getStructureOverview() {
    return this.organizationalStructureService.getOverview();
  }

  @Get('departments/:id/employees')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List employees within a department' })
  @ApiResponse({ status: 200, description: 'List of employees in the department' })
  getDepartmentEmployees(@Param('id') id: string) {
    return this.organizationalStructureService.getDepartmentEmployees(id);
  }

  @Get('departments/:id/positions')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List positions within a department' })
  @ApiResponse({ status: 200, description: 'List of positions in the department' })
  getDepartmentPositions(@Param('id') id: string) {
    return this.organizationalStructureService.getDepartmentPositions(id);
  }
}
