import { QueryResult } from 'pg';
import { Tag } from 'src/core/tags';
import { Database, DbPage } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const getTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['get'] =>
  async (id) => {
    logger.debug(`Getting tag: ${id}`);
    const res: QueryResult<Tag> = await pool.query(queries.tags.select, [id]);

    const tag = res.rows[0];
    if (!tag) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return tag;
  };

const getAllTags =
  ({ logger, pool, queries }: DbInstance): Database['tags']['getAll'] =>
  async (offset, limit) => {
    logger.debug(`Getting tag list ${limit} ${offset}`);
    const res: QueryResult<DbPage<Tag>> = await pool.query(queries.tags.selectAll, [limit, offset]);

    const { count = 0, rows } = res.rows[0] || {};

    return { count, data: rows || [], next: (limit || 0) + offset < count };
  };

const addTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['add'] =>
  async (name) => {
    logger.debug(`Adding tag: ${name}`);
    const res: QueryResult<Tag> = await pool.query(queries.tags.insert, [name]);

    const tag = res.rows[0];
    if (!tag) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return tag;
  };

const updateTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['update'] =>
  async (id, name) => {
    logger.debug(`Updating tag: ${name}`);
    const res: QueryResult<Tag> = await pool.query(queries.tags.update, [name, id]);

    const tag = res.rows[0];
    if (!tag) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return tag;
  };

const removeTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['remove'] =>
  async (id) => {
    logger.debug(`Removing tag: ${id}`);
    await pool.query(queries.tags.delete, [id]);

    return {
      message: 'Ok',
    };
  };

export { addTag, getAllTags, updateTag, getTag, removeTag };
