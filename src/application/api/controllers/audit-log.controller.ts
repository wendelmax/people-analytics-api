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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AuditLogService } from '@core/domain/services/audit-log.service';
import { CreateAuditLogDto, UpdateAuditLogDto } from '@application/api/dto/audit-log.dto';

@ApiTags('audit-logs')
@Controller('audit-logs')
@ApiBearerAuth()
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_DIRECTOR)
  @ApiOperation({ summary: 'Create audit log entry' })
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditLogService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_DIRECTOR, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List audit logs' })
  findAll() {
    return this.auditLogService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_DIRECTOR, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get audit log by ID' })
  findOne(@Param('id') id: string) {
    return this.auditLogService.findById(id);
  }

  @Get('user/:userId')
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_DIRECTOR, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List audit logs for user' })
  findByUser(@Param('userId') userId: string) {
    return this.auditLogService.findByUser(userId);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update audit log' })
  update(@Param('id') id: string, @Body() dto: UpdateAuditLogDto) {
    return this.auditLogService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete audit log' })
  async remove(@Param('id') id: string) {
    await this.auditLogService.delete(id);
  }
}
