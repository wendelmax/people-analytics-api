import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { OffboardingService } from '@core/domain/services/offboarding.service';
import { CreateOffboardingDto, UpdateOffboardingDto } from '@application/api/dto/offboarding.dto';

@ApiTags('offboarding')
@Controller('offboarding')
@ApiBearerAuth()
export class OffboardingController {
  constructor(private readonly offboardingService: OffboardingService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create offboarding workflow' })
  @ApiResponse({ status: 201, description: 'Offboarding workflow created successfully' })
  create(@Body() dto: CreateOffboardingDto) {
    return this.offboardingService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List offboarding workflows' })
  findAll() {
    return this.offboardingService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get offboarding workflow by ID' })
  findOne(@Param('id') id: string) {
    return this.offboardingService.findById(id);
  }

  @Get('employee/:employeeId')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'List offboarding workflows for employee' })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.offboardingService.findByEmployee(employeeId);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update offboarding workflow' })
  update(@Param('id') id: string, @Body() dto: UpdateOffboardingDto) {
    return this.offboardingService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete offboarding workflow' })
  remove(@Param('id') id: string) {
    return this.offboardingService.delete(id);
  }
}
