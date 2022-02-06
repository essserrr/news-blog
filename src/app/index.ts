import { Logger } from 'src/core/logger';
import { App } from 'src/core/app';
import { DatabaseConfig } from 'src/core/database';
import { initDb } from 'src/db';

interface AppProps {
  logger: Logger;
  dbConfig: DatabaseConfig;
}

const initApp = async ({ logger, dbConfig }: AppProps): Promise<App> => {
  const db = await initDb(logger, dbConfig);

  logger.info('App created');
  return {
    logger,
    db,
  };
};

export { initApp };
