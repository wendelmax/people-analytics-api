import { Module } from '@nestjs/common';
import { EmployeeJourneyController } from '@application/api/controller/EmployeeJourneyController';
import { EmployeeJourneyService } from '@application/api/service/EmployeeJourneyService';
import { EmployeeJourneyRepository } from '@infrastructure/repository/EmployeeJourneyRepository';

@Module({
  controllers: [EmployeeJourneyController],
  providers: [
    EmployeeJourneyService,
    {
      provide: 'EmployeeJourneyRepository',
      useClass: EmployeeJourneyRepository,
    },
  ],
  exports: [EmployeeJourneyService],
})
export class EmployeeJourneyModule {}
