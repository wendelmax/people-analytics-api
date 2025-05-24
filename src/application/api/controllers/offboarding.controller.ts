import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';

import { OffboardingService } from '../../../domain/offboarding/services/offboarding.service';
import { CreateOffboardingDto } from '?';
import { UpdateOffboardingDto } from '?';

@ApiTags('offboarding')
@Controller('offboarding')
@ApiBearerAuth()
export class OffboardingController {
  constructor(private readonly offboardingService: OffboardingService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new offboarding record' })
  @ApiResponse({ status: 201, description: 'Offboarding record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createOffboardingDto: CreateOffboardingDto) {
    return this.offboardingService.create(createOffboardingDto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all offboarding records' })
  @ApiResponse({ status: 200, description: 'List of offboarding records' })
  findAll() {
    return this.offboardingService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get offboarding record by ID' })
  @ApiResponse({ status: 200, description: 'Offboarding record details' })
  @ApiResponse({ status: 404, description: 'Offboarding record not found' })
  findOne(@Param('id') id: string) {
    return this.offboardingService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update offboarding record details' })
  @ApiResponse({ status: 200, description: 'Offboarding record updated successfully' })
  @ApiResponse({ status: 404, description: 'Offboarding record not found' })
  update(@Param('id') id: string, @Body() updateOffboardingDto: UpdateOffboardingDto) {
    return this.offboardingService.update(id, updateOffboardingDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove an offboarding record' })
  @ApiResponse({ status: 200, description: 'Offboarding record removed successfully' })
  @ApiResponse({ status: 404, description: 'Offboarding record not found' })
  remove(@Param('id') id: string) {
    return this.offboardingService.remove(id);
  }
}
