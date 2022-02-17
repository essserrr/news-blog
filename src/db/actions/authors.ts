import { QueryResult } from 'pg';
import { Author } from 'src/core/authors';
import { Database, DbPage } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const getAuthor =
  ({ logger, pool, queries }: DbInstance): Database['authors']['get'] =>
  async (uid) => {
    logger.debug(`Getting author: ${uid}`);
    const res: QueryResult<Author> = await pool.query(queries.authors.select, [uid]);

    const author = res.rows[0];
    if (!author) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return author;
  };

const getAllAuthors =
  ({ logger, pool, queries }: DbInstance): Database['authors']['getAll'] =>
  async (offset, limit) => {
    logger.debug(`Getting author list ${limit} ${offset}`);
    const res: QueryResult<DbPage<Author>> = await pool.query(queries.authors.selectAll, [
      limit,
      offset,
    ]);

    const { count = 0, rows } = res.rows[0] || {};

    return { count, data: rows || [], next: limit === null ? false : limit + offset < count };
  };

const addAuthor =
  ({ logger, pool, queries }: DbInstance): Database['authors']['add'] =>
  async ({ uid, description }) => {
    logger.debug(`Adding author ${uid}`);
    const res: QueryResult<Author> = await pool.query(queries.authors.insert, [uid, description]);

    const author = res.rows[0];
    if (!author) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return author;
  };

const updateAuthor =
  ({ logger, pool, queries }: DbInstance): Database['authors']['update'] =>
  async (uid, { description }) => {
    logger.debug(`Updating author: ${uid}`);
    const res: QueryResult<Author> = await pool.query(queries.authors.update, [uid, description]);

    const author = res.rows[0];
    if (!author) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return author;
  };

const removeAuthor =
  ({ logger, pool, queries }: DbInstance): Database['authors']['remove'] =>
  async (id) => {
    logger.debug(`Removing author: ${id}`);
    await pool.query(queries.authors.delete, [id]);

    return {
      message: 'Ok',
    };
  };

export { addAuthor, getAllAuthors, updateAuthor, getAuthor, removeAuthor };
