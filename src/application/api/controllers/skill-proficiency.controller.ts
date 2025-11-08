import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@application/api/auth/guard/jwt-auth.guard';
import { SkillProficiencyService } from '@core/domain/services/skill-proficiency.service';
import { TrackSkillProgressDto } from '@application/api/dto/skill-proficiency.dto';

@ApiTags('skill-proficiency')
@Controller('skill-proficiency')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SkillProficiencyController {
  constructor(private readonly skillProficiencyService: SkillProficiencyService) {}

  @Get('employees/:employeeId')
  @ApiOperation({ summary: 'Get employee skills with proficiency levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns employee skills with proficiency levels',
    type: Array,
  })
  getEmployeeSkills(@Param('employeeId') employeeId: string) {
    return this.skillProficiencyService.getEmployeeSkills(employeeId);
  }

  @Post('track/:employeeId/:skillId')
  @ApiOperation({ summary: 'Track skill progress for an employee' })
  @ApiResponse({ status: 201, description: 'Skill progress tracked successfully', type: Array })
  trackSkillProgress(
    @Param('employeeId') employeeId: string,
    @Param('skillId') skillId: string,
    @Body() data: TrackSkillProgressDto,
  ) {
    return this.skillProficiencyService.trackSkillProgress(employeeId, skillId, data);
  }

  @Get('history/:employeeId/:skillId')
  @ApiOperation({ summary: 'Get skill evolution history' })
  @ApiResponse({ status: 200, description: 'Returns skill evolution history', type: Array })
  getSkillEvolutionHistory(
    @Param('employeeId') employeeId: string,
    @Param('skillId') skillId: string,
  ) {
    return this.skillProficiencyService.getSkillEvolutionHistory(employeeId, skillId);
  }
}
