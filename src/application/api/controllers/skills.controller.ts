import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { SkillsService } from '@core/domain/skills/services/skills.service';
import { CreateSkillDto, UpdateSkillDto } from '@shared/dto/base.dto';

@ApiTags('skills')
@Controller('skills')
@ApiBearerAuth()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all skills' })
  @ApiResponse({ status: 200, description: 'List of skills' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill details' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update skill details' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a skill' })
  @ApiResponse({ status: 200, description: 'Skill removed successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
