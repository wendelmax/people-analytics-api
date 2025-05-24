import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { EmployeeJourneyService } from '@core/domain/employee-journey/services/employee-journey.service';
import { CreateEmployeeJourneyDto, UpdateEmployeeJourneyDto } from '@shared/dto/base.dto';

@ApiTags('employee-journey')
@Controller('employee-journey')
@ApiBearerAuth()
export class EmployeeJourneyController {
  constructor(private readonly employeeJourneyService: EmployeeJourneyService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new employee journey' })
  @ApiResponse({ status: 201, description: 'Employee journey created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createEmployeeJourneyDto: CreateEmployeeJourneyDto) {
    return this.employeeJourneyService.create(createEmployeeJourneyDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all employee journeys' })
  @ApiResponse({ status: 200, description: 'List of employee journeys' })
  findAll() {
    return this.employeeJourneyService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get employee journey by ID' })
  @ApiResponse({ status: 200, description: 'Employee journey details' })
  @ApiResponse({ status: 404, description: 'Employee journey not found' })
  findOne(@Param('id') id: string) {
    return this.employeeJourneyService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update employee journey details' })
  @ApiResponse({ status: 200, description: 'Employee journey updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee journey not found' })
  update(@Param('id') id: string, @Body() updateEmployeeJourneyDto: UpdateEmployeeJourneyDto) {
    return this.employeeJourneyService.update(id, updateEmployeeJourneyDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove an employee journey' })
  @ApiResponse({ status: 200, description: 'Employee journey removed successfully' })
  @ApiResponse({ status: 404, description: 'Employee journey not found' })
  remove(@Param('id') id: string) {
    return this.employeeJourneyService.remove(id);
  }

  @Get('touchpoints/:journeyId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all touchpoints for a journey' })
  @ApiResponse({ status: 200, description: 'List of touchpoints' })
  @ApiResponse({ status: 404, description: 'Journey not found' })
  findAllTouchpoints(@Param('journeyId') journeyId: string) {
    return this.employeeJourneyService.findAllTouchpoints(+journeyId);
  }

  @Post('touchpoints')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new touchpoint' })
  @ApiResponse({ status: 201, description: 'Touchpoint created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createTouchpoint(@Body() touchpointData: any) {
    return this.employeeJourneyService.createTouchpoint(touchpointData);
  }

  @Put('touchpoints/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update touchpoint details' })
  @ApiResponse({ status: 200, description: 'Touchpoint updated successfully' })
  @ApiResponse({ status: 404, description: 'Touchpoint not found' })
  updateTouchpoint(@Param('id') id: string, @Body() updateData: any) {
    return this.employeeJourneyService.updateTouchpoint(+id, updateData);
  }

  @Delete('touchpoints/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a touchpoint' })
  @ApiResponse({ status: 200, description: 'Touchpoint removed successfully' })
  @ApiResponse({ status: 404, description: 'Touchpoint not found' })
  removeTouchpoint(@Param('id') id: string) {
    return this.employeeJourneyService.removeTouchpoint(+id);
  }
}
