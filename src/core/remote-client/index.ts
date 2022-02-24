import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { User } from 'src/core/user';
import { Author } from 'src/core/authors';

type TagBody = Omit<Tag, 'id'>;

type CategoryWithoutId = Omit<Category, 'id'>;
type CategoryInsertBody = Omit<CategoryWithoutId, 'name'>;
type CategoryUpdateBody = Partial<CategoryWithoutId>;

type UserSignupBody = Omit<User, 'uid' | 'authToken' | 'isAdmin' | 'createdAt' | 'username'>;

type AuthorWithoutUid = Omit<Author, 'uid'>;
type AuthorInsertBody = AuthorWithoutUid;
type AuthorUpdateBody = Partial<AuthorWithoutUid>;

interface NewsInsertBody {
  title: string;
  content: string;
  category: number;
  tags: Array<number>;
  mainImage: string;
  auxImages: Array<string>;
}

interface NewsUpdateBody {
  author: string;
  title: string;
  content: string;
  category: number;
  tags: Array<number>;
  mainImage: string;
  auxImages: Array<string>;
}

export type {
  TagBody,
  CategoryInsertBody,
  CategoryUpdateBody,
  UserSignupBody,
  AuthorInsertBody,
  AuthorUpdateBody,
  NewsInsertBody,
  NewsUpdateBody,
};
