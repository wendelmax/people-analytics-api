import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { AdminService } from '@core/domain/services/admin.service';
import { CreateAdminDto, UpdateAdminDto } from '@application/api/dto/admin.dto';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create admin profile' })
  @ApiResponse({ status: 201, description: 'Admin profile created successfully' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'List admin profiles' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get admin profile by ID' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update admin profile' })
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete admin profile' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
