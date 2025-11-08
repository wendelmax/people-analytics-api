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
import { RecommendationService } from '@core/domain/services/recommendation.service';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '@application/api/dto/recommendation.dto';

@ApiTags('recommendations')
@Controller('recommendations')
@ApiBearerAuth()
export class RecommendationsController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create recommendation' })
  @ApiResponse({ status: 201, description: 'Recommendation created successfully' })
  create(@Body() dto: CreateRecommendationDto) {
    return this.recommendationService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List recommendations' })
  findAll() {
    return this.recommendationService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get recommendation by ID' })
  findOne(@Param('id') id: string) {
    return this.recommendationService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update recommendation' })
  update(@Param('id') id: string, @Body() dto: UpdateRecommendationDto) {
    return this.recommendationService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete recommendation' })
  async remove(@Param('id') id: string) {
    await this.recommendationService.delete(id);
  }
}
