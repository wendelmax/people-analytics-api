import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : value;
  });
}

export function ToBoolean() {
  return Transform(({ value }) => {
    if (value === true) return true;
    if (value === false) return false;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  });
}

export function ToNumber() {
  return Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  });
}

export function ToDate() {
  return Transform(({ value }) => {
    if (value instanceof Date) return value;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  });
}
