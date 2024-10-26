import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Get(':employeeId')
    findFeedbackByEmployee(@Param('employeeId') employeeId: string) {
        return this.feedbackService.findByEmployee(+employeeId);
    }

    @Post()
    create(@Body() feedbackData: any) {
        return this.feedbackService.create(feedbackData);
    }
}
