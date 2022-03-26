import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { User, UserUnderscored, UserPasswordReq, UserAuthReq } from 'src/core/user';
import { Author } from 'src/core/authors';
import { NewsUnderscored, NewsRequest, CheckAuthor } from 'src/core/news';
import { DbPage, PaginatedResult, UpdateRequest, DatabaseOptionalValue } from './types';
import {
  Id,
  Name,
  OptionalName,
  Pid,
  OptionalPid,
  Offset,
  Limit,
  Uid,
  SecondName,
  Avatar,
  Username,
  Password,
  CreatedAt,
  IsAdmin,
  AuthToken,
  Description,
  OptionalDescription,
  Title,
  Content,
  Image,
} from './entities';

type Require<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
interface MessageResponse {
  message: string;
}

type TagUpdate = Omit<Tag, 'id'>;

type CategoryInsert = Omit<Category, 'id'>;
type CategoryUpdate = UpdateRequest<Omit<Category, 'id'>>;

type UserSignup = Omit<User, 'uid' | 'createdAt' | 'isAdmin'>;
type UserLogin = Require<Pick<User, 'authToken'>>;

type AuthorInsert = Author;
type AuthorUpdate = UpdateRequest<Omit<Author, 'uid'>>;

interface Database {
  tags: {
    add: (options: TagUpdate) => Promise<Tag>;
    update: (id: Id, options: TagUpdate) => Promise<Tag>;
    remove: (id: Id) => Promise<MessageResponse>;
    get: (id: Id) => Promise<Tag>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<Tag>>;
  };
  categories: {
    add: (options: CategoryInsert) => Promise<Category>;
    update: (id: Id, options: CategoryUpdate) => Promise<Category>;
    remove: (id: Id) => Promise<MessageResponse>;
    get: (id: Id) => Promise<Category>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<Category>>;
  };
  users: {
    signup: (options: UserSignup) => Promise<UserUnderscored>;
    remove: (uid: Uid) => Promise<MessageResponse>;
    get: (uid: Uid) => Promise<UserUnderscored>;
  };
  auth: {
    login: (uid: Username, options: UserLogin) => Promise<UserUnderscored>;
    logout: (uid: Uid) => Promise<MessageResponse>;
    checkPass: (username: Username) => Promise<UserPasswordReq>;
    checkToken: (uid: Uid) => Promise<UserAuthReq>;
  };
  authors: {
    add: (options: AuthorInsert) => Promise<Author>;
    update: (uid: Uid, options: AuthorUpdate) => Promise<Author>;
    remove: (uid: Uid) => Promise<MessageResponse>;
    get: (uid: Uid) => Promise<Author>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<Author>>;
  };
  news: {
    add: (options: NewsRequest) => Promise<NewsUnderscored>;
    get: (nid: Uid) => Promise<NewsUnderscored>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<NewsUnderscored>>;
    update: (nid: Uid, options: NewsRequest) => Promise<NewsUnderscored>;
    checkAuthor: (nid: Uid) => Promise<CheckAuthor>;
    remove: (nid: Uid, uid: Uid) => Promise<MessageResponse>;
  };
}

interface DatabaseConfig {
  databaseUrl?: string;
  ssl: boolean;
}

export type {
  Id,
  Name,
  OptionalName,
  Pid,
  OptionalPid,
  Uid,
  SecondName,
  Avatar,
  Username,
  Password,
  CreatedAt,
  IsAdmin,
  AuthToken,
  Description,
  OptionalDescription,
  Title,
  Content,
  Image,
};
export type { Offset, Limit };
export type { DbPage, PaginatedResult, DatabaseOptionalValue };
export type { TagUpdate, CategoryInsert, CategoryUpdate };
export type { DatabaseConfig, Database };
