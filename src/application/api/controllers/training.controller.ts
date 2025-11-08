import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { TrainingService } from '@core/domain/services/training.service';
import { CreateTrainingDto, UpdateTrainingDto } from '@application/api/dto/training.dto';

@ApiTags('trainings')
@Controller('trainings')
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create training session' })
  @ApiResponse({ status: 201, description: 'Training created successfully' })
  create(@Body() dto: CreateTrainingDto) {
    return this.trainingService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List trainings' })
  findAll() {
    return this.trainingService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get training by ID' })
  findOne(@Param('id') id: string) {
    return this.trainingService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update training session' })
  update(@Param('id') id: string, @Body() dto: UpdateTrainingDto) {
    return this.trainingService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete training session' })
  async remove(@Param('id') id: string) {
    await this.trainingService.delete(id);
  }
}
