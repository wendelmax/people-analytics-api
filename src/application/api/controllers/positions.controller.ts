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
import { PositionService } from '@core/domain/services/position.service';
import { CreatePositionDto, UpdatePositionDto } from '@application/api/dto/position.dto';

@ApiTags('positions')
@Controller('positions')
@ApiBearerAuth()
export class PositionsController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({ status: 201, description: 'Position created successfully' })
  create(@Body() dto: CreatePositionDto) {
    return this.positionService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List positions' })
  findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get position by ID' })
  findOne(@Param('id') id: string) {
    return this.positionService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update position' })
  update(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.positionService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete position' })
  async remove(@Param('id') id: string) {
    await this.positionService.delete(id);
  }
}
