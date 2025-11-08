import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { CareerService } from '@core/domain/services/career.service';

@ApiTags('career')
@Controller('career')
@ApiBearerAuth()
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get('employees/:employeeId/overview')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get career overview for an employee' })
  getEmployeeOverview(@Param('employeeId') employeeId: string) {
    return this.careerService.getEmployeeOverview(employeeId);
  }

  @Get('employees/:employeeId/suggested-paths')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get suggested career paths for an employee' })
  getSuggestedPaths(@Param('employeeId') employeeId: string) {
    return this.careerService.getSuggestedPaths(employeeId);
  }
}
