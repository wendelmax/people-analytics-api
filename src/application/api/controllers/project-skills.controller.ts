import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { ProjectSkillsService } from '@core/domain/services/project-skills.service';
import { ProjectSkillDto } from '@application/api/dto/project-skill.dto';

@ApiTags('project-skills')
@Controller('project-skills')
@ApiBearerAuth()
export class ProjectSkillsController {
  constructor(private readonly projectSkillsService: ProjectSkillsService) {}

  @Get(':projectId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List required skills for a project' })
  listByProject(@Param('projectId') projectId: string) {
    return this.projectSkillsService.listByProject(projectId);
  }

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Assign a skill to a project' })
  @ApiResponse({ status: 201, description: 'Skill assigned to project successfully' })
  addSkill(@Body() dto: ProjectSkillDto) {
    return this.projectSkillsService.addSkill(dto);
  }

  @Delete()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Remove a skill from a project' })
  removeSkill(@Body() dto: ProjectSkillDto) {
    return this.projectSkillsService.removeSkill(dto);
  }
}
