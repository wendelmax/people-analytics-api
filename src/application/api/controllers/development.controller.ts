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
import { DevelopmentPlanService } from '@core/domain/services/development-plan.service';
import {
  CreateDevelopmentPlanDto,
  UpdateDevelopmentPlanDto,
} from '@application/api/dto/development-plan.dto';

@ApiTags('development-plans')
@Controller('development-plans')
@ApiBearerAuth()
export class DevelopmentController {
  constructor(private readonly developmentPlanService: DevelopmentPlanService) {}

  @Post()
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create development plan' })
  @ApiResponse({ status: 201, description: 'Development plan created successfully' })
  create(@Body() dto: CreateDevelopmentPlanDto) {
    return this.developmentPlanService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List development plans' })
  findAll() {
    return this.developmentPlanService.findAll();
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get development plan by ID' })
  findOne(@Param('id') id: string) {
    return this.developmentPlanService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update development plan' })
  update(@Param('id') id: string, @Body() dto: UpdateDevelopmentPlanDto) {
    return this.developmentPlanService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete development plan' })
  async remove(@Param('id') id: string) {
    await this.developmentPlanService.delete(id);
  }
}
