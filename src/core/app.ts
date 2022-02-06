import { Logger } from 'src/core/logger';
import { Database } from 'src/core/database';

export interface App {
  logger: Logger;
  db: Database;
}
