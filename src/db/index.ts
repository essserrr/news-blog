import { Logger } from 'src/core/logger';
import { Database, DatabaseConfig } from 'src/core/database';

import { initTables, connectDb } from './actions/init';
import { getAllTags, getTag, addTag, updateTag, removeTag } from './actions/tags';
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
      getAll: getAllTags(instance),
      get: getTag(instance),
      add: addTag(instance),
      update: updateTag(instance),
      remove: removeTag(instance),
    },
  };
};

export { initDb };
