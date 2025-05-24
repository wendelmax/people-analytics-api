import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationalStructureController } from './organizational-structure.controller';

describe('OrganizationalStructureController', () => {
  let controller: OrganizationalStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationalStructureController],
    }).compile();

    controller = module.get<OrganizationalStructureController>(OrganizationalStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
