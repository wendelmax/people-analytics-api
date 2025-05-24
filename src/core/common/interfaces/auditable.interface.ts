export interface Auditable {
  createdBy?: number;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
}
