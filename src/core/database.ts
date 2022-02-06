import type { MessageResponse } from 'src/core/server';
import { Tag } from './tags';

type Offset = number;
type Limit = number | null;

interface Database {
  tags: {
    add: (name: string) => Promise<Tag | undefined>;
    update: (id: string, name: string) => Promise<Tag | undefined>;
    remove: (id: string) => Promise<MessageResponse>;
    get: (id: string) => Promise<Tag | undefined>;
    getAll: (offset: Offset, limit: Limit) => Promise<Array<Tag>>;
  };
}

interface DatabaseConfig {
  databaseUrl?: string;
  ssl: boolean;
}

export type { DatabaseConfig, Database, Limit, Offset };
