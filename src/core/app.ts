import { Logger } from 'src/core/logger';
import { Database } from 'src/core/database';

interface App {
  logger: Logger;
  db: Database;
}

export type { App };
