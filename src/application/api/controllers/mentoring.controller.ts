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
import { MentoringService } from '@core/domain/services/mentoring.service';
import { CreateMentoringDto, UpdateMentoringDto } from '@application/api/dto/mentoring.dto';

@ApiTags('mentoring')
@Controller('mentoring')
@ApiBearerAuth()
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create mentoring relationship' })
  @ApiResponse({ status: 201, description: 'Mentoring relationship created successfully' })
  create(@Body() dto: CreateMentoringDto) {
    return this.mentoringService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List mentoring relationships' })
  findAll() {
    return this.mentoringService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get mentoring relationship by ID' })
  findOne(@Param('id') id: string) {
    return this.mentoringService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update mentoring relationship' })
  update(@Param('id') id: string, @Body() dto: UpdateMentoringDto) {
    return this.mentoringService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete mentoring relationship' })
  async remove(@Param('id') id: string) {
    await this.mentoringService.delete(id);
  }
}
