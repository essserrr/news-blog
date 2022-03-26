import { QueryResult } from 'pg';
import { NewsUnderscored, CheckAuthor } from 'src/core/news';
import { Database, DbPage } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const addNews =
  ({ logger, pool, queries }: DbInstance): Database['news']['add'] =>
  async ({ tags, author, title, content, category, mainImage, auxImages }) => {
    logger.debug(`Adding news: ${title} from ${author}`);

    const res: QueryResult<NewsUnderscored> = await pool.query(queries.news.insert, [
      author,
      title,
      content,
      category,
      mainImage,
      tags,
      auxImages,
    ]);

    const news = res.rows[0];
    if (!news) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return news;
  };

const getNews =
  ({ logger, pool, queries }: DbInstance): Database['news']['get'] =>
  async (nid) => {
    logger.debug(`Getting news: ${nid}`);

    const res: QueryResult<NewsUnderscored> = await pool.query(queries.news.select, [nid]);

    const news = res.rows[0];
    if (!news) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return news;
  };

const getAllNews =
  ({ logger, pool, queries }: DbInstance): Database['news']['getAll'] =>
  async (offset, limit) => {
    logger.debug(`Getting tag list ${limit} ${offset}`);
    const res: QueryResult<DbPage<NewsUnderscored>> = await pool.query(
      queries.news.selectAll({ filter: 'all', tags: [1], type: 'tag' }),
      [],
    );

    const { count = 0, rows } = res.rows[0] || {};

    return {
      count,
      data: (res.rows as []) || [],
      next: limit === null ? false : limit + offset < count,
    };
  };

const updateNews =
  ({ logger, pool, queries }: DbInstance): Database['news']['update'] =>
  async (nid, { tags, author, title, content, category, mainImage, auxImages }) => {
    logger.debug(`Updating news: ${title} from ${author}`);

    const res: QueryResult<NewsUnderscored> = await pool.query(queries.news.update, [
      nid,
      author,
      title,
      content,
      category,
      mainImage,
      tags,
      auxImages,
    ]);

    const news = res.rows[0];
    if (!news) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return news;
  };

const checkAuthor =
  ({ logger, pool, queries }: DbInstance): Database['news']['checkAuthor'] =>
  async (nid) => {
    logger.debug(`Checking author for news: ${nid}`);

    const res: QueryResult<CheckAuthor> = await pool.query(queries.news.checkAuthor, [nid]);

    const news = res.rows[0];
    if (!news) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return news;
  };

const removeNews =
  ({ logger, pool, queries }: DbInstance): Database['news']['remove'] =>
  async (nid, uid) => {
    logger.debug(`Removing news: ${nid}`);
    await pool.query(queries.news.delete, [nid, uid]);

    return {
      message: 'Ok',
    };
  };

export { addNews, getNews, updateNews, checkAuthor, removeNews, getAllNews };
