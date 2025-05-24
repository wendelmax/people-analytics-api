import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AdminService } from '@core/domain/admin/services/admin.service';
import { CreateAdminDto, UpdateAdminDto } from '@shared/dto/base.dto';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new admin record' })
  @ApiResponse({ status: 201, description: 'Admin record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List all admin records' })
  @ApiResponse({ status: 200, description: 'List of admin records' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get admin record by ID' })
  @ApiResponse({ status: 200, description: 'Admin record details' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update admin record details' })
  @ApiResponse({ status: 200, description: 'Admin record updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Remove an admin record' })
  @ApiResponse({ status: 200, description: 'Admin record removed successfully' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
