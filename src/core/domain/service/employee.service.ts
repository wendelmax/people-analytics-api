import { Employee } from '../employee/entity/Employee';
import { EmployeeRepository } from '../employee/repository/EmployeeRepository';
import { CreateEmployeeEntityPayload } from '../employee/entity/type/CreateEmployeeEntityPayload';
import { EditEmployeeEntityPayload } from '../employee/entity/type/EditEmployeeEntityPayload';
import { Nullable } from '@core/common/type/CommonTypes';

export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  public async findById(id: string): Promise<Nullable<Employee>> {
    return this.repository.findById(id);
  }

  public async findAll(): Promise<Employee[]> {
    return this.repository.findAll();
  }

  public async create(payload: CreateEmployeeEntityPayload): Promise<Employee> {
    const entity = await Employee.new(payload);
    await this.repository.save(entity);

    return entity;
  }

  public async edit(id: string, payload: EditEmployeeEntityPayload): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new Error('Employee not found');
    }

    await entity.edit(payload);
    await this.repository.save(entity);
  }

  public async remove(id: string): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new Error('Employee not found');
    }

    await entity.remove();
    await this.repository.save(entity);
  }
}
