import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorator } from '@application/api/auth/decorator/auth.decorator';
import { UserRole } from '@core/common/enums/UserEnums';
import { KnowledgeCategory } from '@prisma/client';
import { KnowledgeBaseService } from '@core/domain/knowledge-base/services/knowledge-base.service';
import { CreateKnowledgeBaseDto, UpdateKnowledgeBaseDto } from '@shared/dto/base.dto';

@ApiTags('Knowledge Base')
@Controller('knowledge-base')
@ApiBearerAuth()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post()
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new knowledge base article' })
  @ApiResponse({ status: 201, description: 'Knowledge base article created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createDto: CreateKnowledgeBaseDto, @Query('authorId') authorId: string) {
    return this.knowledgeBaseService.create(createDto, +authorId);
  }

  @Get()
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List knowledge base articles' })
  @ApiResponse({ status: 200, description: 'List of knowledge base articles' })
  findAll(
    @Query('category') category?: KnowledgeCategory,
    @Query('tags') tags?: string[],
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.knowledgeBaseService.findAll({ category, tags, searchTerm });
  }

  @Get(':id')
  @AuthDecorator(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get a specific knowledge base article' })
  @ApiResponse({ status: 200, description: 'Knowledge base article details' })
  @ApiResponse({ status: 404, description: 'Knowledge base article not found' })
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findOne(+id);
  }

  @Patch(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update a knowledge base article' })
  @ApiResponse({ status: 200, description: 'Knowledge base article updated successfully' })
  @ApiResponse({ status: 404, description: 'Knowledge base article not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateKnowledgeBaseDto) {
    return this.knowledgeBaseService.update(+id, updateDto);
  }

  @Delete(':id')
  @AuthDecorator(UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete a knowledge base article' })
  @ApiResponse({ status: 200, description: 'Knowledge base article removed successfully' })
  @ApiResponse({ status: 404, description: 'Knowledge base article not found' })
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.remove(+id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search knowledge base articles' })
  searchArticles(@Query('term') searchTerm: string) {
    return this.knowledgeBaseService.searchArticles(searchTerm);
  }
}
