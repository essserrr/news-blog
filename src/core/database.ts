import type { MessageResponse } from 'src/core/server';
import { Tag } from './tags';

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
    add: (name: string) => Promise<Tag>;
    update: (id: number, name: string) => Promise<Tag>;
    remove: (id: number) => Promise<MessageResponse>;
    get: (id: number) => Promise<Tag>;
    getAll: (offset: Offset, limit: Limit) => Promise<PaginatedResult<Tag>>;
  };
}

interface DatabaseConfig {
  databaseUrl?: string;
  ssl: boolean;
}

export type { DatabaseConfig, Database, Limit, Offset, DbPage, PaginatedResult };
