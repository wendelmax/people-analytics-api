import { Module } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { EmployeeService } from './employee.service';
import { DepartmentService } from './department.service';
import { PositionService } from './position.service';
import { SkillService } from './skill.service';
import { ProjectService } from './project.service';
import { TrainingService } from './training.service';
import { PerformanceService } from './performance.service';
import { MentoringService } from './mentoring.service';

@Module({
  providers: [
    PrismaService,
    EmployeeService,
    DepartmentService,
    PositionService,
    SkillService,
    ProjectService,
    TrainingService,
    PerformanceService,
    MentoringService,
  ],
  exports: [
    EmployeeService,
    DepartmentService,
    PositionService,
    SkillService,
    ProjectService,
    TrainingService,
    PerformanceService,
    MentoringService,
  ],
})
export class ServicesModule {}
