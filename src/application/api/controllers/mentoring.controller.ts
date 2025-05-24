import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { MentoringService } from '@core/domain/mentoring/services/mentoring.service';
import { CreateMentoringDto, UpdateMentoringDto } from '@shared/dto/base.dto';

@ApiTags('mentoring')
@Controller('mentoring')
@ApiBearerAuth()
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new mentoring program' })
  @ApiResponse({ status: 201, description: 'Mentoring program created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createMentoringDto: CreateMentoringDto) {
    return this.mentoringService.create(createMentoringDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all mentoring programs' })
  @ApiResponse({ status: 200, description: 'List of mentoring programs' })
  findAll() {
    return this.mentoringService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get mentoring program by ID' })
  @ApiResponse({ status: 200, description: 'Mentoring program details' })
  @ApiResponse({ status: 404, description: 'Mentoring program not found' })
  findOne(@Param('id') id: string) {
    return this.mentoringService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update mentoring program details' })
  @ApiResponse({ status: 200, description: 'Mentoring program updated successfully' })
  @ApiResponse({ status: 404, description: 'Mentoring program not found' })
  update(@Param('id') id: string, @Body() updateMentoringDto: UpdateMentoringDto) {
    return this.mentoringService.update(id, updateMentoringDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a mentoring program' })
  @ApiResponse({ status: 200, description: 'Mentoring program removed successfully' })
  @ApiResponse({ status: 404, description: 'Mentoring program not found' })
  remove(@Param('id') id: string) {
    return this.mentoringService.remove(id);
  }
}
