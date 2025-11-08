import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { NotificationService } from '@core/domain/services/notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  CreateNotificationPreferenceDto,
  UpdateNotificationPreferenceDto,
} from '@application/api/dto/notification.dto';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List notifications' })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update notification' })
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return this.notificationService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  async remove(@Param('id') id: string) {
    await this.notificationService.delete(id);
  }

  @Post('preferences')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Upsert notification preference' })
  upsertPreference(@Body() dto: CreateNotificationPreferenceDto) {
    return this.notificationService.upsertPreference(dto);
  }

  @Patch('preferences/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update notification preference' })
  updatePreference(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return this.notificationService.upsertPreference({ ...dto, employeeId });
  }

  @Get('preferences/:employeeId')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List notification preferences for employee' })
  getPreferences(@Param('employeeId') employeeId: string) {
    return this.notificationService.getPreferences(employeeId);
  }
}
