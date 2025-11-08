import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { OnboardingService } from '@core/domain/services/onboarding.service';
import { CreateOnboardingDto, UpdateOnboardingDto } from '@application/api/dto/onboarding.dto';

@ApiTags('onboarding')
@Controller('onboarding')
@ApiBearerAuth()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create onboarding workflow' })
  @ApiResponse({ status: 201, description: 'Onboarding workflow created successfully' })
  create(@Body() dto: CreateOnboardingDto) {
    return this.onboardingService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List onboarding workflows' })
  findAll() {
    return this.onboardingService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get onboarding workflow by ID' })
  findOne(@Param('id') id: string) {
    return this.onboardingService.findById(id);
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List onboarding workflows for employee' })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.onboardingService.findByEmployee(employeeId);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update onboarding workflow' })
  update(@Param('id') id: string, @Body() dto: UpdateOnboardingDto) {
    return this.onboardingService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete onboarding workflow' })
  remove(@Param('id') id: string) {
    return this.onboardingService.delete(id);
  }
}
