import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

import { GoalService } from '../../../domain/goal/services/goal.service';
import { CreateGoalDto } from '?';
import { UpdateGoalDto } from '?';

@ApiTags('goal')
@Controller('goal')
@ApiBearerAuth()
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new goal record' })
  @ApiResponse({ status: 201, description: 'Goal record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalService.create(createGoalDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all goal records' })
  @ApiResponse({ status: 200, description: 'List of goal records' })
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get goal record by ID' })
  @ApiResponse({ status: 200, description: 'Goal record details' })
  @ApiResponse({ status: 404, description: 'Goal record not found' })
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update goal record details' })
  @ApiResponse({ status: 200, description: 'Goal record updated successfully' })
  @ApiResponse({ status: 404, description: 'Goal record not found' })
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(id, updateGoalDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a goal record' })
  @ApiResponse({ status: 200, description: 'Goal record removed successfully' })
  @ApiResponse({ status: 404, description: 'Goal record not found' })
  remove(@Param('id') id: string) {
    return this.goalService.remove(id);
  }
}
