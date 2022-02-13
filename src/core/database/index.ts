import { Tag } from 'src/core/tags';
import { Category } from 'src/core/categories';
import { DbPage, PaginatedResult, WithoutId, UpdateRequest, DatabaseOptionalValue } from './types';
import { Id, Name, OptionalName, Pid, OptionalPid, Offset, Limit } from './entities';

interface MessageResponse {
  message: string;
}

type TagUpdate = WithoutId<Tag>;

type CategoryInsert = WithoutId<Category>;
type CategoryUpdate = UpdateRequest<WithoutId<Category>>;

interface Database {
  tags: {
    add: (options: TagUpdate) => Promise<Tag>;
    update: (id: number, options: TagUpdate) => Promise<Tag>;
    remove: (id: number) => Promise<MessageResponse>;
    get: (id: number) => Promise<Tag>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<Tag>>;
  };
  categories: {
    add: (options: CategoryInsert) => Promise<Category>;
    update: (id: number, options: CategoryUpdate) => Promise<Category>;
    remove: (id: number) => Promise<MessageResponse>;
    get: (id: number) => Promise<Category>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<Category>>;
  };
}

interface DatabaseConfig {
  databaseUrl?: string;
  ssl: boolean;
}

export type { Id, Name, OptionalName, Pid, OptionalPid };
export type { Offset, Limit };
export type { DbPage, PaginatedResult, DatabaseOptionalValue };
export type { TagUpdate, CategoryInsert, CategoryUpdate };
export type { DatabaseConfig, Database };
