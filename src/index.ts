import * as dotenv from 'dotenv';
import { LOG_LEVEL, PORT, DATABASE_URL, DATABASE_SSL } from 'src/config';
import { initLogger } from './logger';
import { initApp } from './app';
import { initServer } from './server';

dotenv.config();

async function main() {
  const logger = initLogger(LOG_LEVEL);

  try {
    const app = await initApp({
      logger,
      dbConfig: {
        databaseUrl: DATABASE_URL,
        ssl: DATABASE_SSL,
      },
    });

    const server = initServer({ app });
    server.listen(PORT);
    app.logger.info('Listening...');
  } catch (e) {
    logger.error(e, 'main error');
  }
}

main();
