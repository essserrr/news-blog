import { QueryResult } from 'pg';
import { UserUnderscored, UserPasswordReq, UserAuthReq } from 'src/core/user';
import { Database } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const login =
  ({ logger, pool, queries }: DbInstance): Database['auth']['login'] =>
  async (username, { authToken }) => {
    logger.debug(`Logging in user: ${username}`);
    const res: QueryResult<UserUnderscored> = await pool.query(queries.users.login, [
      username,
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

const checkPass =
  ({ logger, pool, queries }: DbInstance): Database['auth']['checkPass'] =>
  async (username) => {
    logger.debug(`Checking password for user: ${username}`);
    const res: QueryResult<UserPasswordReq> = await pool.query(queries.users.checkPass, [username]);

    const user = res.rows[0];
    if (!user) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return user;
  };

const checkToken =
  ({ logger, pool, queries }: DbInstance): Database['auth']['checkToken'] =>
  async (uid) => {
    logger.debug(`Checking token for user: ${uid}`);
    const res: QueryResult<UserAuthReq> = await pool.query(queries.users.checkToken, [uid]);

    const user = res.rows[0];
    if (!user) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return user;
  };

export { login, logout, checkPass, checkToken };
