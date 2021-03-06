import { Category } from './categories';
import { Tag } from './tags';
import { UserUnderscored, User } from './user';
import { Author } from './authors';

type NewsUserUnderscored = Omit<UserUnderscored, 'auth_token' | 'password'>;
type NewsAuthorUnderscored = NewsUserUnderscored & Author;

type NewsUser = Omit<User, 'authToken' | 'password'>;
type NewsAuthor = NewsUser & Author;

interface NewsUnderscored {
  id: string;
  author: NewsAuthorUnderscored | null;
  title: string;
  content: string;
  category: Array<Category>;
  tags: Array<Tag>;
  main_image: string;
  aux_images: Array<string>;
  created_at: number;
  is_draft: boolean;
}

interface News {
  id: string;
  author: NewsAuthor | null;
  title: string;
  content: string;
  category: Array<Category>;
  tags: Array<Tag>;
  mainImage: string;
  auxImages: Array<string>;
  createdAt: number;
}

interface NewsRequest {
  author: string;
  title: string;
  content: string;
  category: number;
  tags: Array<number>;
  mainImage: string;
  auxImages: Array<string>;
}

const mapNewsAuthor = ({
  uid,
  name,
  second_name,
  avatar,
  username,
  created_at,
  is_admin,
  description,
}: NewsAuthorUnderscored): NewsAuthor => ({
  uid,
  description,
  name,
  secondName: second_name,
  avatar,
  username,
  createdAt: created_at,
  isAdmin: is_admin,
});

const mapNews = ({
  id,
  author,
  title,
  content,
  category,
  tags,
  main_image,
  aux_images,
  created_at,
}: NewsUnderscored): News => ({
  id,
  author: author ? mapNewsAuthor(author) : author,
  title,
  content,
  category,
  tags,
  mainImage: main_image,
  auxImages: aux_images,
  createdAt: created_at,
});

type DraftUnderscored = NewsUnderscored;
type DraftRequest = NewsRequest;

export type { News, NewsUnderscored, NewsRequest, DraftUnderscored, DraftRequest };
export { mapNews };
