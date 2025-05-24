import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { RecommendationsService } from '@core/domain/recommendations/services/recommendations.service';
import { CreateRecommendationDto, UpdateRecommendationDto } from '@shared/dto/base.dto';

@ApiTags('recommendations')
@Controller('recommendations')
@ApiBearerAuth()
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new recommendation' })
  @ApiResponse({ status: 201, description: 'Recommendation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationsService.create(createRecommendationDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all recommendations' })
  @ApiResponse({ status: 200, description: 'List of recommendations' })
  findAll() {
    return this.recommendationsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get recommendation by ID' })
  @ApiResponse({ status: 200, description: 'Recommendation details' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  findOne(@Param('id') id: string) {
    return this.recommendationsService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update recommendation details' })
  @ApiResponse({ status: 200, description: 'Recommendation updated successfully' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  update(@Param('id') id: string, @Body() updateRecommendationDto: UpdateRecommendationDto) {
    return this.recommendationsService.update(id, updateRecommendationDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a recommendation' })
  @ApiResponse({ status: 200, description: 'Recommendation removed successfully' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(id);
  }

  @Get('career/:employeeId')
  suggestCareerPath(@Param('employeeId') employeeId: string) {
    return this.recommendationsService.suggestCareerPath(+employeeId);
  }

  @Get('skills/:employeeId')
  suggestSkills(@Param('employeeId') employeeId: string) {
    return this.recommendationsService.suggestSkills(+employeeId);
  }
}
