import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { User } from 'src/core/user';
import { Author } from 'src/core/authors';
import { Comment } from 'src/core/comments';

type TagBody = Omit<Tag, 'id'>;

type CategoryWithoutId = Omit<Category, 'id'>;
type CategoryInsertBody = Omit<CategoryWithoutId, 'name'>;
type CategoryUpdateBody = Partial<CategoryWithoutId>;

type UserSignupBody = Omit<User, 'uid' | 'authToken' | 'isAdmin' | 'createdAt' | 'username'>;

type AuthorWithoutUid = Omit<Author, 'uid'>;
type AuthorInsertBody = AuthorWithoutUid;
type AuthorUpdateBody = Partial<AuthorWithoutUid>;

type CommentInsertBody = Omit<Comment, 'id' | 'nid'>;

type AuthBody = Pick<User, 'password'>;

interface NewsInsertBody {
  title: string;
  content: string;
  category: number;
  tags: Array<number>;
  mainImage: string;
  auxImages: Array<string>;
}

type DraftInsertBody = NewsInsertBody;

export type {
  TagBody,
  CategoryInsertBody,
  CategoryUpdateBody,
  UserSignupBody,
  AuthorInsertBody,
  AuthorUpdateBody,
  NewsInsertBody,
  CommentInsertBody,
  DraftInsertBody,
  AuthBody,
};
