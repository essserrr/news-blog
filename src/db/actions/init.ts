import { Pool, PoolConfig } from 'pg';
import { AppError } from 'src/core/errors';
import { Logger } from 'src/core/logger';
import { DatabaseConfig } from 'src/core/database';
import queries from 'src/db/queries';

type Config = Pick<PoolConfig, 'connectionString' | 'ssl'>;

const parseConfig = ({ databaseUrl, ssl }: DatabaseConfig): Config => {
  if (!databaseUrl)
    throw new AppError({ message: 'Database config: No database url', code: 'WRONG_FORMAT' });
  return {
    connectionString: databaseUrl,
    ssl,
  };
};

const connectDb = async (logger: Logger, config: DatabaseConfig): Promise<Pool> => {
  const pool = new Pool(parseConfig(config));

  logger.debug(config, 'Db instance created with config');

  return pool;
};

const initTables = async (pool: Pool, logger: Logger) => {
  await pool.query(
    `
    ${queries.tags.createTagsTable} 
    ${queries.categories.createCategoriesTable} 
    ${queries.users.createUsersTable} 
    ${queries.authors.createAuthorsTable}
    ${queries.news.createNewsTable}
    ${queries.comments.createCommentsTable}
    `,
  );
  logger.debug('Tables initiated');
};

export { initTables, connectDb };
