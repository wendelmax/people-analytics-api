import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeJourneyController } from './employee-journey.controller';

describe('EmployeeJourneyController', () => {
  let controller: EmployeeJourneyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeJourneyController],
    }).compile();

    controller = module.get<EmployeeJourneyController>(EmployeeJourneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
