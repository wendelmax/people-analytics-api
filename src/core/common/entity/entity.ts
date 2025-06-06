export abstract class Entity {
  protected readonly _id: number;

  constructor(id?: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }
}
