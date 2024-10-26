import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
    constructor(private readonly recommendationsService: RecommendationsService) { }

    @Get('career/:employeeId')
    suggestCareerPath(@Param('employeeId') employeeId: string) {
        return this.recommendationsService.suggestCareerPath(+employeeId);
    }

    @Get('skills/:employeeId')
    suggestSkills(@Param('employeeId') employeeId: string) {
        return this.recommendationsService.suggestSkills(+employeeId);
    }
}
