import { Pool } from 'pg';
import { Logger } from 'src/core/logger';
import queries from './queries';

interface DbInstance {
  pool: Pool;
  logger: Logger;
  queries: typeof queries;
}

export type { DbInstance };
