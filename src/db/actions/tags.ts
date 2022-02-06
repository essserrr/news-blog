import { QueryResult } from 'pg';
import { Tag } from 'src/core/tags';
import { Database } from 'src/core/database';
import { DbInstance } from '../types';

const mock = {
  id: 1,
  name: '111',
};

const getTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['get'] =>
  async (id) => {
    logger.debug(`Getting tag: ${id}`);
    await pool.query(queries.tags.select, [id]);

    return mock;
  };

const getAllTags =
  ({ logger, pool, queries }: DbInstance): Database['tags']['getAll'] =>
  async () => {
    logger.debug('Getting tag list');
    const tags: QueryResult<Tag> = await pool.query(queries.tags.selectAll);
    return tags.rows;
  };

const addTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['add'] =>
  async (name) => {
    logger.debug(`Adding tag: ${name}`);
    await pool.query(queries.tags.insert, [name]);

    return mock;
  };

const updateTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['update'] =>
  async (id, name) => {
    logger.debug(`Updating tag: ${name}`);
    await pool.query(queries.tags.update, [name, id]);

    return mock;
  };

const removeTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['remove'] =>
  async (id) => {
    logger.debug(`Removing tag: ${id}`);
    await pool.query(queries.tags.delete, [id]);

    return mock;
  };

export { addTag, getAllTags, updateTag, getTag, removeTag };
