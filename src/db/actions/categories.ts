import { QueryResult } from 'pg';
import { Category } from 'src/core/categories';
import { Database, DbPage } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const getCategory =
  ({ logger, pool, queries }: DbInstance): Database['categories']['get'] =>
  async (id) => {
    logger.debug(`Getting category: ${id}`);
    const res: QueryResult<Category> = await pool.query(queries.categories.select, [id]);

    const category = res.rows[0];
    if (!category) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return category;
  };

const getAllCategories =
  ({ logger, pool, queries }: DbInstance): Database['categories']['getAll'] =>
  async (offset, limit) => {
    logger.debug(`Getting category list ${limit} ${offset}`);
    const res: QueryResult<DbPage<Category>> = await pool.query(queries.categories.selectAll, [
      limit,
      offset,
    ]);

    const { count = 0, rows } = res.rows[0] || {};

    return { count, data: rows || [], next: (limit || 0) + offset < count };
  };

const addCategory =
  ({ logger, pool, queries }: DbInstance): Database['categories']['add'] =>
  async ({ name, pid }) => {
    logger.debug(`Adding category: ${name}`);
    const res: QueryResult<Category> = await pool.query(queries.categories.insert, [name, pid]);

    const category = res.rows[0];
    if (!category) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return category;
  };

const updateCategory =
  ({ logger, pool, queries }: DbInstance): Database['categories']['update'] =>
  async (id, { name, pid }) => {
    logger.debug(`Updating category: ${name}`);
    const res: QueryResult<Category> = await pool.query(queries.categories.update, [id, name, pid]);

    const category = res.rows[0];
    if (!category) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return category;
  };

const removeCategory =
  ({ logger, pool, queries }: DbInstance): Database['categories']['remove'] =>
  async (id) => {
    logger.debug(`Removing category: ${id}`);
    await pool.query(queries.categories.delete, [id]);

    return {
      message: 'Ok',
    };
  };

export { addCategory, getAllCategories, updateCategory, getCategory, removeCategory };
