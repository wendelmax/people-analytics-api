import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { CompetencyAssessmentService } from '@core/domain/competency-assessment/services/competency-assessment.service';
import {
  CreateAssessmentPeriodDto,
  CreateCompetencyAssessmentDto,
  UpdateAssessmentPeriodStatusDto,
  UpdateCompetencyAssessmentDto,
} from '@shared/dto/base.dto';

@ApiTags('Competency Assessments')
@Controller('competency-assessments')
@ApiBearerAuth()
export class CompetencyAssessmentController {
  constructor(private readonly competencyAssessmentService: CompetencyAssessmentService) {}

  @Post('period')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new assessment period' })
  createAssessmentPeriod(@Body() createDto: CreateAssessmentPeriodDto) {
    return this.competencyAssessmentService.createAssessmentPeriod(
      createDto.name,
      new Date(createDto.startDate),
      new Date(createDto.endDate),
    );
  }

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new competency assessment' })
  @ApiResponse({ status: 201, description: 'Competency assessment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createCompetencyAssessment(@Body() createDto: CreateCompetencyAssessmentDto) {
    return this.competencyAssessmentService.create(createDto);
  }

  @Get('periods')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all assessment periods' })
  findAllAssessmentPeriods() {
    return this.competencyAssessmentService.findAllAssessmentPeriods();
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get competency assessments for an employee' })
  findCompetencyAssessmentsByEmployee(@Param('employeeId') employeeId: string) {
    return this.competencyAssessmentService.findCompetencyAssessmentsByEmployee(+employeeId);
  }

  @Patch('period/:periodId/status')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update assessment period status' })
  updateAssessmentPeriodStatus(
    @Param('periodId') periodId: string,
    @Body() updateDto: UpdateAssessmentPeriodStatusDto,
  ) {
    return this.competencyAssessmentService.updateAssessmentPeriodStatus(
      +periodId,
      updateDto.status,
    );
  }

  @Get('employee/:employeeId/score')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Calculate employee competency score' })
  calculateEmployeeCompetencyScore(@Param('employeeId') employeeId: string) {
    return this.competencyAssessmentService.calculateEmployeeCompetencyScore(+employeeId);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all competency assessments' })
  @ApiResponse({ status: 200, description: 'List of competency assessments' })
  findAll() {
    return this.competencyAssessmentService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get competency assessment by ID' })
  @ApiResponse({ status: 200, description: 'Competency assessment details' })
  @ApiResponse({ status: 404, description: 'Competency assessment not found' })
  findOne(@Param('id') id: string) {
    return this.competencyAssessmentService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update competency assessment details' })
  @ApiResponse({ status: 200, description: 'Competency assessment updated successfully' })
  @ApiResponse({ status: 404, description: 'Competency assessment not found' })
  update(
    @Param('id') id: string,
    @Body() updateCompetencyAssessmentDto: UpdateCompetencyAssessmentDto,
  ) {
    return this.competencyAssessmentService.update(id, updateCompetencyAssessmentDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove a competency assessment' })
  @ApiResponse({ status: 200, description: 'Competency assessment removed successfully' })
  @ApiResponse({ status: 404, description: 'Competency assessment not found' })
  remove(@Param('id') id: string) {
    return this.competencyAssessmentService.remove(id);
  }
}
