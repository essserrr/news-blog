import type { MessageResponse } from 'src/core/server';
import { Tag, TagUpdate } from './tags';
import { Category, CategoryUpdate, CategoryInsert } from './categories';

type Offset = number;
type Limit = number | null;

type DbPage<T> = {
  count: number;
  rows: Array<T>;
};

type PaginatedResult<T> = {
  count: number;
  data: Array<T>;
  next: boolean;
};

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

export type { DatabaseConfig, Database, Limit, Offset, DbPage, PaginatedResult };
