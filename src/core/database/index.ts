import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { User, UserUnderscored, UserPasswordReq, UserAuthReq } from 'src/core/user';
import { Author, CheckAuthor } from 'src/core/authors';
import { NewsUnderscored, NewsRequest, DraftUnderscored, DraftRequest } from 'src/core/news';
import { Comment } from 'src/core/comments';

import { DbPage, PaginatedResult, UpdateRequest, DatabaseOptionalValue } from './types';
import { Filters, AuthorFilter } from './filters';
import { Sorting, DateSort } from './sorting';
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
  DateString,
  SortingType,
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

type CommentInsert = Omit<Comment, 'id'>;

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
    getAll: (options: {
      filter: Filters;
      sorting: Sorting;
      offset: Offset;
      limit: Limit;
    }) => Promise<PaginatedResult<NewsUnderscored>>;
    update: (nid: Uid, options: NewsRequest) => Promise<NewsUnderscored>;
    checkAuthor: (nid: Uid) => Promise<CheckAuthor>;
    remove: (nid: Uid) => Promise<MessageResponse>;
  };
  drafts: {
    add: (options: DraftRequest) => Promise<DraftUnderscored>;
    get: (nid: Uid) => Promise<DraftUnderscored>;
    getAll: (options: {
      filter: AuthorFilter;
      sorting: DateSort;
      offset: Offset;
      limit: Limit;
    }) => Promise<PaginatedResult<DraftUnderscored>>;
    update: (nid: Uid, options: DraftRequest) => Promise<DraftUnderscored>;
    checkAuthor: (nid: Uid) => Promise<CheckAuthor>;
    remove: (nid: Uid) => Promise<MessageResponse>;
  };
  comments: {
    add: (options: CommentInsert) => Promise<Comment>;
    remove: (id: Uid) => Promise<MessageResponse>;
    checkAuthor: (nid: Uid) => Promise<CheckAuthor>;
    getAll: (nid: Uid, offset: Offset, limit: Limit) => Promise<PaginatedResult<Comment>>;
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
  DateString,
  SortingType,
};
export type { Offset, Limit };
export type { DbPage, PaginatedResult, DatabaseOptionalValue };
export type { TagUpdate, CategoryInsert, CategoryUpdate };
export type { DatabaseConfig, Database };
