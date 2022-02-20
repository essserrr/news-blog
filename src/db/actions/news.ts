import { QueryResult } from 'pg';
import { NewsUnderscored } from 'src/core/news';
import { Database } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const addNews =
  ({ logger, pool, queries }: DbInstance): Database['news']['add'] =>
  async ({ tags, author, title, content, category, mainImage }) => {
    logger.debug(`Adding news: ${title} from ${author}`);

    const addNewsQuery = queries.news.insert(tags);

    const res: QueryResult<NewsUnderscored> = await pool.query(addNewsQuery, [
      author,
      title,
      content,
      category,
      mainImage,
    ]);

    const news = res.rows[0];
    if (!news) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return news;
  };

export { addNews };
