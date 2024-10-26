import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Get()
    findAll() {
        return this.skillsService.findAll();
    }

    @Post()
    create(@Body() skillData: any) {
        return this.skillsService.create(skillData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.skillsService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.skillsService.remove(+id);
    }
}
