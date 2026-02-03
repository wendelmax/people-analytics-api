import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { KnowledgeBaseService } from '@core/domain/services/knowledge-base.service';
import {
  CreateKnowledgeArticleDto,
  UpdateKnowledgeArticleDto,
  KnowledgeArticleQueryDto,
} from '@application/api/dto/knowledge-base.dto';

@ApiTags('knowledge-base')
@Controller('knowledge-base')
@ApiBearerAuth()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create knowledge base article' })
  @ApiResponse({ status: 201, description: 'Knowledge base article created successfully' })
  create(@Body() dto: CreateKnowledgeArticleDto) {
    return this.knowledgeBaseService.create(dto);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List knowledge base articles' })
  findAll(@Query() query: KnowledgeArticleQueryDto) {
    return this.knowledgeBaseService.findAll(query);
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get knowledge base article by ID' })
  @ApiParam({ name: 'id', description: 'ID do artigo' })
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findById(id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update knowledge base article' })
  update(@Param('id') id: string, @Body() dto: UpdateKnowledgeArticleDto) {
    return this.knowledgeBaseService.update(id, dto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete knowledge base article' })
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.delete(id);
  }

  @Get('search')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Search knowledge base content' })
  @ApiQuery({ name: 'term', description: 'Termo de busca' })
  search(@Query('term') searchTerm: string) {
    return this.knowledgeBaseService.searchArticles(searchTerm);
  }
}
