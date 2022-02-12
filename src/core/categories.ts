interface Category {
  id: number;
  pid: number | null;
  name: string;
}

type CategoryUpdate = Omit<Category, 'id'>;

export type { Category, CategoryUpdate };
