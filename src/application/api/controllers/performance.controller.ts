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
import { PerformanceService } from '@core/domain/services/performance.service';
import {
  CreatePerformanceReviewDto,
  UpdatePerformanceReviewDto,
} from '@application/api/dto/performance-review.dto';

@ApiTags('performance-reviews')
@Controller('performance-reviews')
@ApiBearerAuth()
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post()
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create performance review' })
  @ApiResponse({ status: 201, description: 'Performance review created successfully' })
  create(@Body() dto: CreatePerformanceReviewDto) {
    return this.performanceService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List performance reviews' })
  findAll() {
    return this.performanceService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get performance review by ID' })
  findOne(@Param('id') id: string) {
    return this.performanceService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update performance review' })
  update(@Param('id') id: string, @Body() dto: UpdatePerformanceReviewDto) {
    return this.performanceService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete performance review' })
  async remove(@Param('id') id: string) {
    await this.performanceService.delete(id);
  }
}
