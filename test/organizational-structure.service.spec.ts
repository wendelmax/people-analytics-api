import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationalStructureService } from './organizational-structure.service';

describe('OrganizationalStructureService', () => {
  let service: OrganizationalStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationalStructureService],
    }).compile();

    service = module.get<OrganizationalStructureService>(OrganizationalStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
