import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { EmployeeJourneyService } from '@core/domain/services/employee-journey.service';
import {
  CreateEmployeeJourneyDto,
  UpdateEmployeeJourneyDto,
  CreateJourneyTouchpointDto,
  UpdateJourneyTouchpointDto,
} from '@application/api/dto/employee-journey.dto';

@ApiTags('employee-journeys')
@Controller('employee-journeys')
@ApiBearerAuth()
export class EmployeeJourneyController {
  constructor(private readonly employeeJourneyService: EmployeeJourneyService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create employee journey' })
  @ApiResponse({ status: 201, description: 'Employee journey created successfully' })
  create(@Body() dto: CreateEmployeeJourneyDto) {
    return this.employeeJourneyService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List employee journeys' })
  findAll() {
    return this.employeeJourneyService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get employee journey by ID' })
  findOne(@Param('id') id: string) {
    return this.employeeJourneyService.findById(id);
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List journeys for employee' })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.employeeJourneyService.findByEmployee(employeeId);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update employee journey' })
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeJourneyDto) {
    return this.employeeJourneyService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete employee journey' })
  remove(@Param('id') id: string) {
    return this.employeeJourneyService.delete(id);
  }

  @Get(':journeyId/touchpoints')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List journey touchpoints' })
  getTouchpoints(@Param('journeyId') journeyId: string) {
    return this.employeeJourneyService.findAllTouchpoints(journeyId);
  }

  @Post('touchpoints')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create journey touchpoint' })
  createTouchpoint(@Body() dto: CreateJourneyTouchpointDto) {
    return this.employeeJourneyService.createTouchpoint(dto);
  }

  @Patch('touchpoints/:id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update journey touchpoint' })
  updateTouchpoint(@Param('id') id: string, @Body() dto: UpdateJourneyTouchpointDto) {
    return this.employeeJourneyService.updateTouchpoint(id, dto);
  }

  @Delete('touchpoints/:id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete journey touchpoint' })
  removeTouchpoint(@Param('id') id: string) {
    return this.employeeJourneyService.removeTouchpoint(id);
  }
}
