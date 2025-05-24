import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { TrainingService } from '@core/domain/training/services/training.service';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
  EnrollEmployeeDto,
  UpdateTrainingStatusDto,
} from '@core/domain/training/dto/create-training.dto';

@ApiTags('training')
@Controller('training')
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new training' })
  @ApiResponse({ status: 201, description: 'Training created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingService.create(createTrainingDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all trainings' })
  @ApiResponse({ status: 200, description: 'List of trainings' })
  findAll() {
    return this.trainingService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get training by ID' })
  @ApiResponse({ status: 200, description: 'Training details' })
  @ApiResponse({ status: 404, description: 'Training not found' })
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update training details' })
  @ApiResponse({ status: 200, description: 'Training updated successfully' })
  @ApiResponse({ status: 404, description: 'Training not found' })
  update(@Param('id') id: string, @Body() updateTrainingDto: UpdateTrainingDto) {
    return this.trainingService.update(id, updateTrainingDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a training' })
  @ApiResponse({ status: 200, description: 'Training removed successfully' })
  @ApiResponse({ status: 404, description: 'Training not found' })
  remove(@Param('id') id: string) {
    return this.trainingService.remove(id);
  }

  @Post('enroll')
  @ApiOperation({ summary: 'Enroll an employee in a training' })
  enrollEmployee(@Body() enrollEmployeeDto: EnrollEmployeeDto) {
    return this.trainingService.enrollEmployee(
      enrollEmployeeDto.trainingId,
      enrollEmployeeDto.employeeId,
    );
  }

  @Patch('employee-training-status')
  @ApiOperation({ summary: 'Update employee training status' })
  updateEmployeeTrainingStatus(@Body() updateStatusDto: UpdateTrainingStatusDto) {
    return this.trainingService.updateEnrollmentStatus(
      updateStatusDto.employeeTrainingId,
      updateStatusDto.status,
    );
  }
}
