import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompetencyAssessmentService } from '@core/domain/services/competency-assessment.service';
import {
  CreateCompetencyAssessmentDto,
  UpdateCompetencyAssessmentDto,
  CreateAssessmentPeriodDto,
  UpdateAssessmentPeriodDto,
  UpdateAssessmentPeriodStatusDto,
} from '@application/api/dto/competency-assessment.dto';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

@ApiTags('competency-assessment')
@Controller('competency-assessment')
@ApiBearerAuth()
export class CompetencyAssessmentController {
  constructor(private readonly competencyAssessmentService: CompetencyAssessmentService) {}

  @Post('periods')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create assessment period' })
  createPeriod(@Body() dto: CreateAssessmentPeriodDto) {
    return this.competencyAssessmentService.createAssessmentPeriod(dto);
  }

  @Get('periods')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List assessment periods' })
  findAllPeriods() {
    return this.competencyAssessmentService.findAllAssessmentPeriods();
  }

  @Patch('periods/:id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update assessment period' })
  updatePeriod(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssessmentPeriodDto,
  ) {
    return this.competencyAssessmentService.updateAssessmentPeriod(id, dto);
  }

  @Patch('periods/:id/status')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update assessment period status' })
  updatePeriodStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssessmentPeriodStatusDto,
  ) {
    return this.competencyAssessmentService.updateAssessmentPeriodStatus(id, dto);
  }

  @Post()
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create competency assessment' })
  create(@Body() dto: CreateCompetencyAssessmentDto) {
    return this.competencyAssessmentService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List competency assessments' })
  findAll() {
    return this.competencyAssessmentService.findAll();
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List assessments by employee' })
  findByEmployee(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.competencyAssessmentService.findCompetencyAssessmentsByEmployee(employeeId);
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get competency assessment by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.competencyAssessmentService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update competency assessment' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompetencyAssessmentDto,
  ) {
    return this.competencyAssessmentService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete competency assessment' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.competencyAssessmentService.remove(id);
  }
}
