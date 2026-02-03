import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeSkillService {
  findAll(): Promise<unknown[]> {
    return Promise.resolve([]);
  }
}
