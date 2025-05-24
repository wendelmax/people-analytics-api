import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { PerformanceInsightsService } from '@core/domain/performance-insights/services/performance-insights.service';
import { CreatePerformanceInsightDto, UpdatePerformanceInsightDto } from '@shared/dto/base.dto';

@ApiTags('performance-insights')
@Controller('performance-insights')
@ApiBearerAuth()
export class PerformanceInsightsController {
  constructor(private readonly performanceInsightsService: PerformanceInsightsService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new performance insight' })
  @ApiResponse({ status: 201, description: 'Performance insight created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createPerformanceInsightDto: CreatePerformanceInsightDto) {
    return this.performanceInsightsService.create(createPerformanceInsightDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all performance insights' })
  @ApiResponse({ status: 200, description: 'List of performance insights' })
  findAll() {
    return this.performanceInsightsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get performance insight by ID' })
  @ApiResponse({ status: 200, description: 'Performance insight details' })
  @ApiResponse({ status: 404, description: 'Performance insight not found' })
  findOne(@Param('id') id: string) {
    return this.performanceInsightsService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update performance insight details' })
  @ApiResponse({ status: 200, description: 'Performance insight updated successfully' })
  @ApiResponse({ status: 404, description: 'Performance insight not found' })
  update(
    @Param('id') id: string,
    @Body() updatePerformanceInsightDto: UpdatePerformanceInsightDto,
  ) {
    return this.performanceInsightsService.update(id, updatePerformanceInsightDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a performance insight' })
  @ApiResponse({ status: 200, description: 'Performance insight removed successfully' })
  @ApiResponse({ status: 404, description: 'Performance insight not found' })
  remove(@Param('id') id: string) {
    return this.performanceInsightsService.remove(id);
  }
}
