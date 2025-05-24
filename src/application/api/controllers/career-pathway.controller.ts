import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

import { CareerService } from '@core/domain/career/service/CareerService';
import { CreateCareerPathwayDto } from '?';
import { UpdateCareerPathwayDto } from '?';

@ApiTags('career-pathway')
@Controller('career-pathway')
@ApiBearerAuth()
export class CareerPathwayController {
  constructor(private readonly careerPathwayService: CareerService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new career pathway' })
  @ApiResponse({ status: 201, description: 'Career pathway created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCareerPathwayDto: CreateCareerPathwayDto) {
    return this.careerPathwayService.create(createCareerPathwayDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all career pathways' })
  @ApiResponse({ status: 200, description: 'List of career pathways' })
  findAll() {
    return this.careerPathwayService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get career pathway by ID' })
  @ApiResponse({ status: 200, description: 'Career pathway details' })
  @ApiResponse({ status: 404, description: 'Career pathway not found' })
  findOne(@Param('id') id: string) {
    return this.careerPathwayService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update career pathway details' })
  @ApiResponse({ status: 200, description: 'Career pathway updated successfully' })
  @ApiResponse({ status: 404, description: 'Career pathway not found' })
  update(@Param('id') id: string, @Body() updateCareerPathwayDto: UpdateCareerPathwayDto) {
    return this.careerPathwayService.update(id, updateCareerPathwayDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a career pathway' })
  @ApiResponse({ status: 200, description: 'Career pathway removed successfully' })
  @ApiResponse({ status: 404, description: 'Career pathway not found' })
  remove(@Param('id') id: string) {
    return this.careerPathwayService.remove(id);
  }
}
