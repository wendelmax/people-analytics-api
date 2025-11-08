import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { CareerPathService } from '@core/domain/services/career-path.service';
import { CreateCareerPathDto, UpdateCareerPathDto } from '@application/api/dto/career-path.dto';

@ApiTags('career-paths')
@Controller('career-paths')
@ApiBearerAuth()
export class CareerPathwayController {
  constructor(private readonly careerPathService: CareerPathService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create career path' })
  @ApiResponse({ status: 201, description: 'Career path created successfully' })
  create(@Body() dto: CreateCareerPathDto) {
    return this.careerPathService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List career paths' })
  findAll() {
    return this.careerPathService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get career path by ID' })
  findOne(@Param('id') id: string) {
    return this.careerPathService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update career path' })
  update(@Param('id') id: string, @Body() dto: UpdateCareerPathDto) {
    return this.careerPathService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete career path' })
  remove(@Param('id') id: string) {
    return this.careerPathService.delete(id);
  }
}
