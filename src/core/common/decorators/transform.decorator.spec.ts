import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';

import { ToBoolean, ToDate, ToNumber, Trim } from './transform.decorator';

class TransformDto {
  @Trim()
  name?: string;

  @ToBoolean()
  flag?: boolean;

  @ToNumber()
  amount?: number;

  @ToDate()
  occurredAt?: Date;
}

describe('transform decorators', () => {
  it('trims string values', () => {
    const dto = plainToInstance(TransformDto, { name: '  Alice  ' });

    expect(dto.name).toBe('Alice');
  });

  it('converts truthy and falsy strings to boolean', () => {
    const truthy = plainToInstance(TransformDto, { flag: 'true' });
    const falsy = plainToInstance(TransformDto, { flag: 'false' });
    const invalid = plainToInstance(TransformDto, { flag: 'maybe' });

    expect(truthy.flag).toBe(true);
    expect(falsy.flag).toBe(false);
    expect(invalid.flag).toBeUndefined();
  });

  it('converts numeric inputs to numbers', () => {
    const dto = plainToInstance(TransformDto, { amount: '42' });
    const invalid = plainToInstance(TransformDto, { amount: 'NaN' });

    expect(dto.amount).toBe(42);
    expect(invalid.amount).toBeUndefined();
  });

  it('converts date-like inputs to Date instances', () => {
    const dto = plainToInstance(TransformDto, { occurredAt: '2024-01-01T00:00:00.000Z' });
    const fromDate = plainToInstance(TransformDto, {
      occurredAt: new Date('2024-01-02T00:00:00.000Z'),
    });
    const invalid = plainToInstance(TransformDto, { occurredAt: 'not-a-date' });

    expect(dto.occurredAt).toBeInstanceOf(Date);
    expect(dto.occurredAt?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(fromDate.occurredAt?.toISOString()).toBe('2024-01-02T00:00:00.000Z');
    expect(invalid.occurredAt).toBeUndefined();
  });
});
