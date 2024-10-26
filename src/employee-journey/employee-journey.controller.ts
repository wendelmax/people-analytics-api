import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EmployeeJourneyService } from './employee-journey.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employee-journey')
@Controller('employee-journey')
export class EmployeeJourneyController {
    constructor(private readonly journeyService: EmployeeJourneyService) { }

    @Get('journeys')
    findAllJourneys() {
        return this.journeyService.findAllJourneys();
    }

    @Post('journeys')
    createJourney(@Body() journeyData: any) {
        return this.journeyService.createJourney(journeyData);
    }

    @Put('journeys/:id')
    updateJourney(@Param('id') id: string, @Body() updateData: any) {
        return this.journeyService.updateJourney(+id, updateData);
    }

    @Delete('journeys/:id')
    removeJourney(@Param('id') id: string) {
        return this.journeyService.removeJourney(+id);
    }

    @Get('touchpoints/:journeyId')
    findAllTouchpoints(@Param('journeyId') journeyId: string) {
        return this.journeyService.findAllTouchpoints(+journeyId);
    }

    @Post('touchpoints')
    createTouchpoint(@Body() touchpointData: any) {
        return this.journeyService.createTouchpoint(touchpointData);
    }

    @Put('touchpoints/:id')
    updateTouchpoint(@Param('id') id: string, @Body() updateData: any) {
        return this.journeyService.updateTouchpoint(+id, updateData);
    }

    @Delete('touchpoints/:id')
    removeTouchpoint(@Param('id') id: string) {
        return this.journeyService.removeTouchpoint(+id);
    }
}
