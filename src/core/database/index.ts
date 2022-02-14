import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { User, UserUnderscored } from 'src/core/user';
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
    remove: (id: Uid) => Promise<MessageResponse>;
    get: (id: Uid) => Promise<UserUnderscored>;
  };
  auth: {
    login: (id: Uid, options: UserLogin) => Promise<UserUnderscored>;
    logout: (id: Uid) => Promise<MessageResponse>;
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
};
export type { Offset, Limit };
export type { DbPage, PaginatedResult, DatabaseOptionalValue };
export type { TagUpdate, CategoryInsert, CategoryUpdate };
export type { DatabaseConfig, Database };
