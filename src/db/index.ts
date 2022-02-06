import { Logger } from 'src/core/logger';
import { Database, DatabaseConfig } from 'src/core/database';

import { initTables, connectDb } from './actions/init';
import { addTag, getAllTags } from './actions/tags';
import { DbInstance } from './types';
import queries from './queries';

const initDb = async (logger: Logger, config: DatabaseConfig): Promise<Database> => {
  const pool = await connectDb(logger, config);
  await initTables(pool, logger);

  logger.info('DB created');

  const instance: DbInstance = {
    pool,
    logger,
    queries,
  };

  return {
    tags: {
      add: addTag(instance),
      getAll: getAllTags(instance),
    },
  };
};

export { initDb };
