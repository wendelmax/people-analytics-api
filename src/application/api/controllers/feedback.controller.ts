import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

import { FeedbackService } from '../../../domain/feedback/services/feedback.service';
import { CreateFeedbackDto } from '?';
import { UpdateFeedbackDto } from '?';

@ApiTags('feedback')
@Controller('feedback')
@ApiBearerAuth()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new feedback record' })
  @ApiResponse({ status: 201, description: 'Feedback record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all feedback records' })
  @ApiResponse({ status: 200, description: 'List of feedback records' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get feedback record by ID' })
  @ApiResponse({ status: 200, description: 'Feedback record details' })
  @ApiResponse({ status: 404, description: 'Feedback record not found' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update feedback record details' })
  @ApiResponse({ status: 200, description: 'Feedback record updated successfully' })
  @ApiResponse({ status: 404, description: 'Feedback record not found' })
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a feedback record' })
  @ApiResponse({ status: 200, description: 'Feedback record removed successfully' })
  @ApiResponse({ status: 404, description: 'Feedback record not found' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
