import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrganizationalStructureService } from './organizational-structure.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('organizational-structure')
@Controller('organizational-structure')
export class OrganizationalStructureController {
    constructor(private readonly orgService: OrganizationalStructureService) { }

    @Get('departments')
    findAllDepartments() {
        return this.orgService.findAllDepartments();
    }

    @Post('departments')
    createDepartment(@Body() departmentData: any) {
        return this.orgService.createDepartment(departmentData);
    }

    @Put('departments/:id')
    updateDepartment(@Param('id') id: string, @Body() updateData: any) {
        return this.orgService.updateDepartment(+id, updateData);
    }

    @Delete('departments/:id')
    removeDepartment(@Param('id') id: string) {
        return this.orgService.removeDepartment(+id);
    }

    @Get('positions')
    findAllPositions() {
        return this.orgService.findAllPositions();
    }

    @Post('positions')
    createPosition(@Body() positionData: any) {
        return this.orgService.createPosition(positionData);
    }

    @Put('positions/:id')
    updatePosition(@Param('id') id: string, @Body() updateData: any) {
        return this.orgService.updatePosition(+id, updateData);
    }

    @Delete('positions/:id')
    removePosition(@Param('id') id: string) {
        return this.orgService.removePosition(+id);
    }
}
