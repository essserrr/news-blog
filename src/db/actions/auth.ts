import { QueryResult } from 'pg';
import { UserUnderscored } from 'src/core/user';
import { Database } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const login =
  ({ logger, pool, queries }: DbInstance): Database['auth']['login'] =>
  async (uid, { authToken }) => {
    logger.debug(`Logging in user: ${uid}`);
    const res: QueryResult<UserUnderscored> = await pool.query(queries.users.login, [
      uid,
      authToken,
    ]);

    const user = res.rows[0];
    if (!user) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return user;
  };

const logout =
  ({ logger, pool, queries }: DbInstance): Database['auth']['logout'] =>
  async (uid) => {
    logger.debug(`Logging out user: ${uid}`);
    await pool.query(queries.users.logout, [uid]);

    return {
      message: 'Ok',
    };
  };

export { login, logout };
