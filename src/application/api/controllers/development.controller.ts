import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { DevelopmentService } from '@core/domain/development/services/development.service';
import { CreateDevelopmentDto, UpdateDevelopmentDto } from '@shared/dto/base.dto';

@ApiTags('development')
@Controller('development')
@ApiBearerAuth()
export class DevelopmentController {
  constructor(private readonly developmentService: DevelopmentService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new development plan' })
  @ApiResponse({ status: 201, description: 'Development plan created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createDevelopmentDto: CreateDevelopmentDto) {
    return this.developmentService.create(createDevelopmentDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all development plans' })
  @ApiResponse({ status: 200, description: 'List of development plans' })
  findAll() {
    return this.developmentService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get development plan by ID' })
  @ApiResponse({ status: 200, description: 'Development plan details' })
  @ApiResponse({ status: 404, description: 'Development plan not found' })
  findOne(@Param('id') id: string) {
    return this.developmentService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update development plan details' })
  @ApiResponse({ status: 200, description: 'Development plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Development plan not found' })
  update(@Param('id') id: string, @Body() updateDevelopmentDto: UpdateDevelopmentDto) {
    return this.developmentService.update(id, updateDevelopmentDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a development plan' })
  @ApiResponse({ status: 200, description: 'Development plan removed successfully' })
  @ApiResponse({ status: 404, description: 'Development plan not found' })
  remove(@Param('id') id: string) {
    return this.developmentService.remove(id);
  }
}
