import { QueryResult } from 'pg';
import { Tag } from 'src/core/tags';
import { Database } from 'src/core/database';
import { DbInstance } from '../types';

const getTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['get'] =>
  async (id) => {
    logger.debug(`Getting tag: ${id}`);
    const tag: QueryResult<Tag> = await pool.query(queries.tags.select, [id]);
    return tag.rows[0];
  };

const getAllTags =
  ({ logger, pool, queries }: DbInstance): Database['tags']['getAll'] =>
  async (offset, limit) => {
    logger.debug(`Getting tag list ${limit} ${offset}`);
    const tags: QueryResult<Tag> = await pool.query(queries.tags.selectAll, [limit, offset]);
    logger.debug(tags);
    return tags.rows;
  };

const addTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['add'] =>
  async (name) => {
    logger.debug(`Adding tag: ${name}`);
    const tag: QueryResult<Tag> = await pool.query(queries.tags.insert, [name]);

    return tag.rows[0];
  };

const updateTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['update'] =>
  async (id, name) => {
    logger.debug(`Updating tag: ${name}`);
    const tag: QueryResult<Tag> = await pool.query(queries.tags.update, [name, id]);

    return tag.rows[0];
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
