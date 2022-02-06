import { Pool } from 'pg';
import { Logger } from 'src/core/logger';
import queries from './queries';

export interface DbInstance {
  pool: Pool;
  logger: Logger;
  queries: typeof queries;
}
