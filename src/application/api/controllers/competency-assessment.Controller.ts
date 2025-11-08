import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { CompetencyAssessmentService } from '@core/domain/services/competency-assessment.service';
import {
  CreateAssessmentPeriodDto,
  CreateCompetencyAssessmentDto,
  UpdateAssessmentPeriodDto,
  UpdateAssessmentPeriodStatusDto,
  UpdateCompetencyAssessmentDto,
} from '@application/api/dto/competency-assessment.dto';

@ApiTags('competency-assessments')
@Controller('competency-assessments')
@ApiBearerAuth()
export class CompetencyAssessmentController {
  constructor(private readonly competencyAssessmentService: CompetencyAssessmentService) {}

  @Post('periods')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create assessment period' })
  createAssessmentPeriod(@Body() dto: CreateAssessmentPeriodDto) {
    return this.competencyAssessmentService.createAssessmentPeriod(dto);
  }

  @Patch('periods/:periodId')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update assessment period' })
  updateAssessmentPeriod(
    @Param('periodId') periodId: string,
    @Body() dto: UpdateAssessmentPeriodDto,
  ) {
    return this.competencyAssessmentService.updateAssessmentPeriod(periodId, dto);
  }

  @Patch('periods/:periodId/status')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Change assessment period status' })
  updateAssessmentPeriodStatus(
    @Param('periodId') periodId: string,
    @Body() dto: UpdateAssessmentPeriodStatusDto,
  ) {
    return this.competencyAssessmentService.updateAssessmentPeriodStatus(periodId, dto);
  }

  @Get('periods')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List assessment periods' })
  findAllAssessmentPeriods() {
    return this.competencyAssessmentService.findAllAssessmentPeriods();
  }

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create competency assessment' })
  @ApiResponse({ status: 201, description: 'Competency assessment created successfully' })
  createCompetencyAssessment(@Body() dto: CreateCompetencyAssessmentDto) {
    return this.competencyAssessmentService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List competency assessments' })
  findAll() {
    return this.competencyAssessmentService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get competency assessment by ID' })
  findOne(@Param('id') id: string) {
    return this.competencyAssessmentService.findOne(id);
  }

  @Get('employees/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List assessments for an employee' })
  findCompetencyAssessmentsByEmployee(@Param('employeeId') employeeId: string) {
    return this.competencyAssessmentService.findCompetencyAssessmentsByEmployee(employeeId);
  }

  @Get('employees/:employeeId/score')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Calculate employee competency score' })
  calculateEmployeeCompetencyScore(@Param('employeeId') employeeId: string) {
    return this.competencyAssessmentService.calculateEmployeeCompetencyScore(employeeId);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update competency assessment' })
  update(@Param('id') id: string, @Body() dto: UpdateCompetencyAssessmentDto) {
    return this.competencyAssessmentService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete competency assessment' })
  remove(@Param('id') id: string) {
    return this.competencyAssessmentService.remove(id);
  }
}
