import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

import { EmployeeService } from '@core/domain/services/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '@application/api/dto/employee.dto';

@ApiTags('employee')
@Controller('employee')
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new employee record' })
  @ApiResponse({ status: 201, description: 'Employee record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all employee records' })
  @ApiResponse({ status: 200, description: 'List of employee records' })
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get employee record by ID' })
  @ApiResponse({ status: 200, description: 'Employee record details' })
  @ApiResponse({ status: 404, description: 'Employee record not found' })
  findOne(@Param('id') id: string) {
    return this.employeeService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update employee record details' })
  @ApiResponse({ status: 200, description: 'Employee record updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee record not found' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an employee record' })
  @ApiResponse({ status: 204, description: 'Employee record removed successfully' })
  @ApiResponse({ status: 404, description: 'Employee record not found' })
  async remove(@Param('id') id: string) {
    await this.employeeService.delete(id);
  }
}
