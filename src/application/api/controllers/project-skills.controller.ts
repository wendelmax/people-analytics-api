import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { ProjectSkillsService } from '@core/domain/project-skills/services/project-skills.service';
import { CreateProjectSkillDto, UpdateProjectSkillDto } from '@shared/dto/base.dto';

@ApiTags('project-skills')
@Controller('project-skills')
@ApiBearerAuth()
export class ProjectSkillsController {
  constructor(private readonly projectSkillsService: ProjectSkillsService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new project skill' })
  @ApiResponse({ status: 201, description: 'Project skill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createProjectSkillDto: CreateProjectSkillDto) {
    return this.projectSkillsService.create(createProjectSkillDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all project skills' })
  @ApiResponse({ status: 200, description: 'List of project skills' })
  findAll() {
    return this.projectSkillsService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get project skill by ID' })
  @ApiResponse({ status: 200, description: 'Project skill details' })
  @ApiResponse({ status: 404, description: 'Project skill not found' })
  findOne(@Param('id') id: string) {
    return this.projectSkillsService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update project skill details' })
  @ApiResponse({ status: 200, description: 'Project skill updated successfully' })
  @ApiResponse({ status: 404, description: 'Project skill not found' })
  update(@Param('id') id: string, @Body() updateProjectSkillDto: UpdateProjectSkillDto) {
    return this.projectSkillsService.update(id, updateProjectSkillDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a project skill' })
  @ApiResponse({ status: 200, description: 'Project skill removed successfully' })
  @ApiResponse({ status: 404, description: 'Project skill not found' })
  remove(@Param('id') id: string) {
    return this.projectSkillsService.remove(id);
  }
}
