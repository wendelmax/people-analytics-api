export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: string | number | boolean;
}
