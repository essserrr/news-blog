import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';

type TagBody = Omit<Tag, 'id'>;

type CategoryWithoutId = Omit<Category, 'id'>;
type CategoryInsertBody = Omit<CategoryWithoutId, 'name'>;
type CategoryUpdateBody = Partial<CategoryWithoutId>;

export type { TagBody, CategoryInsertBody, CategoryUpdateBody };
