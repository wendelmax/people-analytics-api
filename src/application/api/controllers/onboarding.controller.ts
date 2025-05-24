import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

import { OnboardingService } from '../../../domain/onboarding/services/onboarding.service';
import { CreateOnboardingDto } from '?';
import { UpdateOnboardingDto } from '?';

@ApiTags('onboarding')
@Controller('onboarding')
@ApiBearerAuth()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new onboarding record' })
  @ApiResponse({ status: 201, description: 'Onboarding record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.onboardingService.create(createOnboardingDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all onboarding records' })
  @ApiResponse({ status: 200, description: 'List of onboarding records' })
  findAll() {
    return this.onboardingService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get onboarding record by ID' })
  @ApiResponse({ status: 200, description: 'Onboarding record details' })
  @ApiResponse({ status: 404, description: 'Onboarding record not found' })
  findOne(@Param('id') id: string) {
    return this.onboardingService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update onboarding record details' })
  @ApiResponse({ status: 200, description: 'Onboarding record updated successfully' })
  @ApiResponse({ status: 404, description: 'Onboarding record not found' })
  update(@Param('id') id: string, @Body() updateOnboardingDto: UpdateOnboardingDto) {
    return this.onboardingService.update(id, updateOnboardingDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove an onboarding record' })
  @ApiResponse({ status: 200, description: 'Onboarding record removed successfully' })
  @ApiResponse({ status: 404, description: 'Onboarding record not found' })
  remove(@Param('id') id: string) {
    return this.onboardingService.remove(id);
  }
}
