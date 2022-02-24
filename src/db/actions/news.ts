import { QueryResult } from 'pg';
import { NewsUnderscored, CheckAuthor } from 'src/core/news';
import { Database } from 'src/core/database';
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
  async (uid) => {
    logger.debug(`Getting news: ${uid}`);

    const res: QueryResult<NewsUnderscored> = await pool.query(queries.news.select, [uid]);

    const news = res.rows[0];
    if (!news) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return news;
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

export { addNews, getNews, updateNews, checkAuthor };
