import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeJourneyService } from './employee-journey.service';

describe('EmployeeJourneyService', () => {
  let service: EmployeeJourneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeJourneyService],
    }).compile();

    service = module.get<EmployeeJourneyService>(EmployeeJourneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
