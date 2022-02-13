import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { User } from 'src/core/user';

type TagBody = Omit<Tag, 'id'>;

type CategoryWithoutId = Omit<Category, 'id'>;
type CategoryInsertBody = Omit<CategoryWithoutId, 'name'>;
type CategoryUpdateBody = Partial<CategoryWithoutId>;

type UserSignupBody = Omit<User, 'uid' | 'authToken' | 'isAdmin' | 'createdAt' | 'username'>;

export type { TagBody, CategoryInsertBody, CategoryUpdateBody, UserSignupBody };
