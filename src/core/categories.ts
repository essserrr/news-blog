interface Category {
  id: number;
  pid: number | null;
  name: string;
}

type CategoryWithoutId = Omit<Category, 'id'>;

type CategoryInsert = CategoryWithoutId;
type CategoryInsertBody = Omit<CategoryWithoutId, 'name'>;

type UpdateRequest<T> = { [K in keyof T]: null extends T[K] ? T[K] | '(null_value)' : T[K] | null };

type CategoryUpdate = UpdateRequest<CategoryWithoutId>;
type CategoryUpdateBody = Partial<CategoryWithoutId>;

export type { Category, CategoryUpdate, CategoryUpdateBody, CategoryInsert, CategoryInsertBody };
