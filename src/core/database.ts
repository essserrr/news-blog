import { Tag } from './tags';

interface Database {
  tags: {
    add: (name: string) => Promise<Tag>;
    update: (id: string, name: string) => Promise<Tag>;
    remove: (id: string) => Promise<Tag>;
    get: (id: string) => Promise<Tag>;
    getAll: () => Promise<Array<Tag>>;
  };
}

interface DatabaseConfig {
  databaseUrl?: string;
  ssl: boolean;
}

export type { DatabaseConfig, Database };
