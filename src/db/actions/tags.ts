import { QueryResult } from 'pg';
import { Tag } from 'src/core/tags';
import { Database } from 'src/core/database';
import { DbInstance } from '../types';

const mock = {
  id: 1,
  name: '111',
};

const addTag =
  ({ logger, pool, queries }: DbInstance): Database['tags']['add'] =>
  async (tag) => {
    logger.debug(`Inserting tag: ${tag}`);
    await pool.query(queries.tags.insert, [tag]);

    return mock;
  };

const getAllTags =
  ({ logger, pool, queries }: DbInstance): Database['tags']['getAll'] =>
  async () => {
    logger.debug('Getting tag list');
    const tags: QueryResult<Tag> = await pool.query(queries.tags.selectAll);
    return tags.rows;
  };

export { addTag, getAllTags };
