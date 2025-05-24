import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@application/api/auth/guard/jwt-auth.guard';
import { SkillProficiencyService } from '@core/domain/skill-proficiency/services/skill-proficiency.service';
import { TrackSkillProgressDto } from '@shared/dto/base.dto';

@ApiTags('skill-proficiency')
@Controller('skill-proficiency')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SkillProficiencyController {
  constructor(private readonly skillProficiencyService: SkillProficiencyService) {}

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get employee skills with proficiency levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns employee skills with proficiency levels',
    type: Array,
  })
  async getEmployeeSkills(@Param('employeeId') employeeId: number) {
    return this.skillProficiencyService.getEmployeeSkills(employeeId);
  }

  @Post('track/:employeeId/:skillId')
  @ApiOperation({ summary: 'Track skill progress for an employee' })
  @ApiResponse({
    status: 201,
    description: 'Skill progress tracked successfully',
    type: Object,
  })
  async trackSkillProgress(
    @Param('employeeId') employeeId: number,
    @Param('skillId') skillId: number,
    @Body() data: TrackSkillProgressDto,
  ) {
    return this.skillProficiencyService.trackSkillProgress(
      employeeId,
      skillId,
      data.proficiencyLevel,
      data.evidence,
    );
  }

  @Get('history/:employeeId/:skillId')
  @ApiOperation({ summary: 'Get skill evolution history' })
  @ApiResponse({
    status: 200,
    description: 'Returns skill evolution history',
    type: Array,
  })
  async getSkillEvolutionHistory(
    @Param('employeeId') employeeId: number,
    @Param('skillId') skillId: number,
  ) {
    return this.skillProficiencyService.getSkillEvolutionHistory(employeeId, skillId);
  }
}
