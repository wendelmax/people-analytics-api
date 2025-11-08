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
import { FeedbackService } from '@core/domain/services/feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from '@application/api/dto/feedback.dto';

@ApiTags('feedback')
@Controller('feedback')
@ApiBearerAuth()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List feedback entries' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get feedback by ID' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update feedback' })
  update(@Param('id') id: string, @Body() dto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete feedback entry' })
  async remove(@Param('id') id: string) {
    await this.feedbackService.delete(id);
  }
}
