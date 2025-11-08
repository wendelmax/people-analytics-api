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
import { GoalService } from '@core/domain/services/goal.service';
import { CreateGoalDto, UpdateGoalDto } from '@application/api/dto/goal.dto';

@ApiTags('goals')
@Controller('goals')
@ApiBearerAuth()
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create goal' })
  @ApiResponse({ status: 201, description: 'Goal created successfully' })
  create(@Body() dto: CreateGoalDto) {
    return this.goalService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List goals' })
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get goal by ID' })
  findOne(@Param('id') id: string) {
    return this.goalService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update goal' })
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete goal' })
  async remove(@Param('id') id: string) {
    await this.goalService.delete(id);
  }
}
