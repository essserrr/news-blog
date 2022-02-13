import { QueryResult } from 'pg';
import { UserUnderscored } from 'src/core/user';
import { Database } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const getUser =
  ({ logger, pool, queries }: DbInstance): Database['users']['get'] =>
  async (uid) => {
    logger.debug(`Getting user: ${uid}`);
    const res: QueryResult<UserUnderscored> = await pool.query(queries.users.select, [uid]);

    const user = res.rows[0];
    if (!user) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return user;
  };

const signup =
  ({ logger, pool, queries }: DbInstance): Database['users']['signup'] =>
  async ({ name, secondName, username, password, avatar, authToken }) => {
    logger.debug(`Registering user: ${username}`);
    const res: QueryResult<UserUnderscored> = await pool.query(queries.users.signup, [
      name,
      secondName,
      avatar,
      username,
      password,
      authToken,
    ]);

    const user = res.rows[0];
    if (!user) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return user;
  };

const removeUser =
  ({ logger, pool, queries }: DbInstance): Database['users']['remove'] =>
  async (uid) => {
    logger.debug(`Removing user: ${uid}`);
    await pool.query(queries.users.delete, [uid]);

    return {
      message: 'Ok',
    };
  };

export { signup, getUser, removeUser };
