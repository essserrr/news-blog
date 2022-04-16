import { QueryResult } from 'pg';
import { Comment } from 'src/core/comments';
import { Database, DbPage } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const getAllComments =
  ({ logger, pool, queries }: DbInstance): Database['comments']['getAll'] =>
  async (nid, offset, limit) => {
    logger.debug(`Getting comments list ${nid} ${limit} ${offset}`);
    const res: QueryResult<DbPage<Comment>> = await pool.query(queries.comments.selectAll, [
      nid,
      limit,
      offset,
    ]);

    const { count = 0, rows } = res.rows[0] || {};

    return { count, data: rows || [], next: limit === null ? false : limit + offset < count };
  };

const addComment =
  ({ logger, pool, queries }: DbInstance): Database['comments']['add'] =>
  async ({ nid, uid, message }) => {
    logger.debug(`Adding comment from: ${uid}, to: ${nid}`);
    const res: QueryResult<Comment> = await pool.query(queries.comments.insert, [
      nid,
      uid,
      message,
    ]);

    const tag = res.rows[0];
    if (!tag) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return tag;
  };

const removeComment =
  ({ logger, pool, queries }: DbInstance): Database['comments']['remove'] =>
  async (id) => {
    logger.debug(`Removing comment: ${id}`);
    await pool.query(queries.comments.delete, [id]);

    return {
      message: 'Ok',
    };
  };

export { addComment, getAllComments, removeComment };
