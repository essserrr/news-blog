type DbPage<T> = {
  count: number;
  rows: Array<T>;
};

type PaginatedResult<T> = {
  count: number;
  data: Array<T>;
  next: boolean;
};

type DatabaseOptionalValue<T> = null extends T ? T | '(null_value)' : T | null;

type WithoutId<T> = Omit<T, 'id'>;
type UpdateRequest<T> = { [K in keyof T]: DatabaseOptionalValue<T[K]> };

export type { DbPage, PaginatedResult, WithoutId, UpdateRequest, DatabaseOptionalValue };
