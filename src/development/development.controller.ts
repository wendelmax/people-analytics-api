import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DevelopmentService } from './development.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('development')
@Controller('development')
export class DevelopmentController {
    constructor(private readonly developmentService: DevelopmentService) { }

    @Get()
    findAll() {
        return this.developmentService.findAll();
    }

    @Post()
    create(@Body() devItemData: any) {
        return this.developmentService.create(devItemData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.developmentService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.developmentService.remove(+id);
    }
}
