import { OrganizationalStructure } from '../organizational-structure/entity/OrganizationalStructure';
import { OrganizationalStructureRepository } from '../organizational-structure/repository/OrganizationalStructureRepository';
import { CreateOrganizationalStructureEntityPayload } from '../organizational-structure/entity/type/CreateOrganizationalStructureEntityPayload';
import { EditOrganizationalStructureEntityPayload } from '../organizational-structure/entity/type/EditOrganizationalStructureEntityPayload';
import { Nullable } from '@core/common/type/CommonTypes';

export class OrganizationalStructureService {
  constructor(private readonly repository: OrganizationalStructureRepository) {}

  public async findById(id: string): Promise<Nullable<OrganizationalStructure>> {
    return this.repository.findById(id);
  }

  public async findAll(): Promise<OrganizationalStructure[]> {
    return this.repository.findAll();
  }

  public async create(
    payload: CreateOrganizationalStructureEntityPayload,
  ): Promise<OrganizationalStructure> {
    const entity = await OrganizationalStructure.new(payload);
    await this.repository.save(entity);

    return entity;
  }

  public async edit(id: string, payload: EditOrganizationalStructureEntityPayload): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new Error('Organizational structure not found');
    }

    await entity.edit(payload);
    await this.repository.save(entity);
  }

  public async remove(id: string): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new Error('Organizational structure not found');
    }

    await entity.remove();
    await this.repository.save(entity);
  }
}
