import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { OrganizationalStructureService } from '@core/domain/organizational-structure/service/OrganizationalStructureService';
import { CreateDepartmentDto } from '?';
import { UpdateDepartmentDto } from '?';
import { CreatePositionDto } from '?';
import { UpdatePositionDto } from '?';

@ApiTags('organizational-structure')
@Controller('organizational-structure')
@ApiBearerAuth()
export class OrganizationalStructureController {
  constructor(private readonly organizationalStructureService: OrganizationalStructureService) {}

  // Department endpoints
  @Post('departments')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.organizationalStructureService.createDepartment(createDepartmentDto);
  }

  @Get('departments')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all departments' })
  @ApiResponse({ status: 200, description: 'List of departments' })
  findAllDepartments() {
    return this.organizationalStructureService.findAllDepartments();
  }

  @Get('departments/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiResponse({ status: 200, description: 'Department details' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOneDepartment(@Param('id') id: string) {
    return this.organizationalStructureService.findOneDepartment(id);
  }

  @Patch('departments/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update department details' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.organizationalStructureService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete('departments/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a department' })
  @ApiResponse({ status: 200, description: 'Department removed successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  removeDepartment(@Param('id') id: string) {
    return this.organizationalStructureService.removeDepartment(id);
  }

  // Position endpoints
  @Post('positions')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({ status: 201, description: 'Position created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createPosition(@Body() createPositionDto: CreatePositionDto) {
    return this.organizationalStructureService.createPosition(createPositionDto);
  }

  @Get('positions')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all positions' })
  @ApiResponse({ status: 200, description: 'List of positions' })
  findAllPositions() {
    return this.organizationalStructureService.findAllPositions();
  }

  @Get('positions/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get position by ID' })
  @ApiResponse({ status: 200, description: 'Position details' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  findOnePosition(@Param('id') id: string) {
    return this.organizationalStructureService.findOnePosition(id);
  }

  @Patch('positions/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update position details' })
  @ApiResponse({ status: 200, description: 'Position updated successfully' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  updatePosition(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.organizationalStructureService.updatePosition(id, updatePositionDto);
  }

  @Delete('positions/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a position' })
  @ApiResponse({ status: 200, description: 'Position removed successfully' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  removePosition(@Param('id') id: string) {
    return this.organizationalStructureService.removePosition(id);
  }

  // Structure overview endpoints
  @Get('overview')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get organizational structure overview' })
  @ApiResponse({ status: 200, description: 'Organizational structure overview' })
  getStructureOverview() {
    return this.organizationalStructureService.getStructureOverview();
  }

  @Get('departments/:id/employees')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get employees by department' })
  @ApiResponse({ status: 200, description: 'List of employees in department' })
  getDepartmentEmployees(@Param('id') id: string) {
    return this.organizationalStructureService.getDepartmentEmployees(id);
  }

  @Get('departments/:id/positions')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get positions by department' })
  @ApiResponse({ status: 200, description: 'List of positions in department' })
  getDepartmentPositions(@Param('id') id: string) {
    return this.organizationalStructureService.getDepartmentPositions(id);
  }
}
