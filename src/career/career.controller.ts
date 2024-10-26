import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CareerService } from './career.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('career')
@Controller('career')
export class CareerController {
    constructor(private readonly careerService: CareerService) { }

    @Get('positions')
    findAllPositions() {
        return this.careerService.findAllPositions();
    }

    @Post('positions')
    createPosition(@Body() positionData: any) {
        return this.careerService.createPosition(positionData);
    }

    @Put('positions/:id')
    updatePosition(@Param('id') id: string, @Body() updateData: any) {
        return this.careerService.updatePosition(+id, updateData);
    }

    @Delete('positions/:id')
    removePosition(@Param('id') id: string) {
        return this.careerService.removePosition(+id);
    }

    @Get('pathways')
    findAllPathways() {
        return this.careerService.findAllPathways();
    }

    @Post('pathways')
    createPathway(@Body() pathwayData: any) {
        return this.careerService.createPathway(pathwayData);
    }

    @Put('pathways/:id')
    updatePathway(@Param('id') id: string, @Body() updateData: any) {
        return this.careerService.updatePathway(+id, updateData);
    }

    @Delete('pathways/:id')
    removePathway(@Param('id') id: string) {
        return this.careerService.removePathway(+id);
    }
}
