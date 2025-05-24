import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { PerformanceService } from '@core/domain/performance/services/performance.service';
import { CreatePerformanceDto, UpdatePerformanceDto } from '@shared/dto/base.dto';

@ApiTags('performance')
@Controller('performance')
@ApiBearerAuth()
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new performance record' })
  @ApiResponse({ status: 201, description: 'Performance record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createPerformanceDto: CreatePerformanceDto) {
    return this.performanceService.create(createPerformanceDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all performance records' })
  @ApiResponse({ status: 200, description: 'List of performance records' })
  findAll() {
    return this.performanceService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get performance record by ID' })
  @ApiResponse({ status: 200, description: 'Performance record details' })
  @ApiResponse({ status: 404, description: 'Performance record not found' })
  findOne(@Param('id') id: string) {
    return this.performanceService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update performance record details' })
  @ApiResponse({ status: 200, description: 'Performance record updated successfully' })
  @ApiResponse({ status: 404, description: 'Performance record not found' })
  update(@Param('id') id: string, @Body() updatePerformanceDto: UpdatePerformanceDto) {
    return this.performanceService.update(id, updatePerformanceDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a performance record' })
  @ApiResponse({ status: 200, description: 'Performance record removed successfully' })
  @ApiResponse({ status: 404, description: 'Performance record not found' })
  remove(@Param('id') id: string) {
    return this.performanceService.remove(id);
  }
}
