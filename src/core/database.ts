import { Tag } from './tags';

export interface Database {
  tags: {
    add: (tag: string) => Promise<Tag>;
    getAll: () => Promise<Array<Tag>>;
  };
}

export interface DatabaseConfig {
  databaseUrl?: string;
  ssl: boolean;
}
