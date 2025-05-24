import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { CareerService } from '@core/domain/career/services/career.service';
import { CreateCareerDto } from '@shared/dto/base.dto';
import { UpdateCareerDto } from '@shared/dto/base.dto';

@ApiTags('career')
@Controller('career')
@ApiBearerAuth()
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new career record' })
  @ApiResponse({ status: 201, description: 'Career record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all career records' })
  @ApiResponse({ status: 200, description: 'List of career records' })
  findAll() {
    return this.careerService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get career record by ID' })
  @ApiResponse({ status: 200, description: 'Career record details' })
  @ApiResponse({ status: 404, description: 'Career record not found' })
  findOne(@Param('id') id: string) {
    return this.careerService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update career record details' })
  @ApiResponse({ status: 200, description: 'Career record updated successfully' })
  @ApiResponse({ status: 404, description: 'Career record not found' })
  update(@Param('id') id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careerService.update(id, updateCareerDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a career record' })
  @ApiResponse({ status: 200, description: 'Career record removed successfully' })
  @ApiResponse({ status: 404, description: 'Career record not found' })
  remove(@Param('id') id: string) {
    return this.careerService.remove(id);
  }

  @Get('positions')
  findAllPositions() {
    return this.careerService.findAllPositions();
  }

  @Post('positions')
  createPosition(@Body() positionData: any) {
    return this.careerService.createPosition(positionData);
  }

  @Put('positions/:id')
  updatePosition(@Param('id') id: string, @Body() updateData: any) {
    return this.careerService.updatePosition(+id, updateData);
  }

  @Delete('positions/:id')
  removePosition(@Param('id') id: string) {
    return this.careerService.removePosition(+id);
  }

  @Get('pathways')
  findAllPathways() {
    return this.careerService.findAllPathways();
  }

  @Post('pathways')
  createPathway(@Body() pathwayData: any) {
    return this.careerService.createPathway(pathwayData);
  }

  @Put('pathways/:id')
  updatePathway(@Param('id') id: string, @Body() updateData: any) {
    return this.careerService.updatePathway(+id, updateData);
  }

  @Delete('pathways/:id')
  removePathway(@Param('id') id: string) {
    return this.careerService.removePathway(+id);
  }

  @Get('stages')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all career stages' })
  @ApiResponse({ status: 200, description: 'List of career stages' })
  findAllStages() {
    return this.careerService.findAllStages();
  }

  @Get('stages/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get career stage by ID' })
  @ApiResponse({ status: 200, description: 'Career stage details' })
  @ApiResponse({ status: 404, description: 'Career stage not found' })
  findOneStage(@Param('id') id: string) {
    return this.careerService.findOneStage(id);
  }

  @Get('positions/:id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get career position by ID' })
  @ApiResponse({ status: 200, description: 'Career position details' })
  @ApiResponse({ status: 404, description: 'Career position not found' })
  findOnePosition(@Param('id') id: string) {
    return this.careerService.findOnePosition(id);
  }
}
