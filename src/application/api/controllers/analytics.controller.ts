import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AnalyticsService } from '@core/domain/analytics/services/analytics.service';
import { CreateAnalyticsDto, UpdateAnalyticsDto } from '@shared/dto/base.dto';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new analytics record' })
  @ApiResponse({ status: 201, description: 'Analytics record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createAnalyticsDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createAnalyticsDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all analytics records' })
  @ApiResponse({ status: 200, description: 'List of analytics records' })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get analytics record by ID' })
  @ApiResponse({ status: 200, description: 'Analytics record details' })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update analytics record details' })
  @ApiResponse({ status: 200, description: 'Analytics record updated successfully' })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  update(@Param('id') id: string, @Body() updateAnalyticsDto: UpdateAnalyticsDto) {
    return this.analyticsService.update(id, updateAnalyticsDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove an analytics record' })
  @ApiResponse({ status: 200, description: 'Analytics record removed successfully' })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  remove(@Param('id') id: string) {
    return this.analyticsService.remove(id);
  }
}
