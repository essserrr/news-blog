import { QueryResult } from 'pg';
import { DraftUnderscored } from 'src/core/news';
import { CheckAuthor } from 'src/core/authors';
import { Database, DbPage } from 'src/core/database';
import { AppError } from 'src/core/errors';
import { DbInstance } from '../types';

const addDraft =
  ({ logger, pool, queries }: DbInstance): Database['drafts']['add'] =>
  async ({ tags, author, title, content, category, mainImage, auxImages }) => {
    logger.debug(`Adding draft: ${title} from ${author}`);

    const res: QueryResult<DraftUnderscored> = await pool.query(queries.news.insert, [
      author,
      title,
      content,
      category,
      mainImage,
      tags,
      auxImages,
      true,
    ]);

    const draft = res.rows[0];
    if (!draft) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return draft;
  };

const getDraft =
  ({ logger, pool, queries }: DbInstance): Database['drafts']['get'] =>
  async (nid) => {
    logger.debug(`Getting draft: ${nid}`);

    const res: QueryResult<DraftUnderscored> = await pool.query(queries.news.select, [nid]);

    const draft = res.rows[0];
    if (!draft) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return draft;
  };

const getAllDraft =
  ({ logger, pool, queries }: DbInstance): Database['drafts']['getAll'] =>
  async ({ offset, limit, filter, sorting }) => {
    logger.debug(`Getting drafts list ${limit} ${offset}`);
    const res: QueryResult<DbPage<DraftUnderscored>> = await pool.query(
      queries.news.selectAllDrafts(filter, sorting, offset, limit),
      [],
    );

    const { count = 0, rows } = res.rows[0] || {};

    return {
      count,
      data: rows || [],
      next: limit === null ? false : limit + offset < count,
    };
  };

const updateDraft =
  ({ logger, pool, queries }: DbInstance): Database['drafts']['update'] =>
  async (nid, { tags, author, title, content, category, mainImage, auxImages }) => {
    logger.debug(`Updating draft: ${title} from ${author}`);

    const res: QueryResult<DraftUnderscored> = await pool.query(queries.news.update, [
      nid,
      author,
      title,
      content,
      category,
      mainImage,
      tags,
      auxImages,
    ]);

    const draft = res.rows[0];
    if (!draft) throw new AppError({ errorType: 'Database error', code: 'UNKNOWN_ERROR' });
    return draft;
  };

const checkDraftAuthor =
  ({ logger, pool, queries }: DbInstance): Database['drafts']['checkAuthor'] =>
  async (nid) => {
    logger.debug(`Checking author for draft: ${nid}`);

    const res: QueryResult<CheckAuthor> = await pool.query(queries.news.checkAuthor, [nid, true]);

    const draft = res.rows[0];
    if (!draft) throw new AppError({ errorType: 'Database error', code: 'NOT_FOUND' });
    return draft;
  };

const removeDraft =
  ({ logger, pool, queries }: DbInstance): Database['drafts']['remove'] =>
  async (nid, uid) => {
    logger.debug(`Removing draft: ${nid}`);
    await pool.query(queries.news.delete, [nid, uid]);

    return {
      message: 'Ok',
    };
  };

export { addDraft, getDraft, updateDraft, checkDraftAuthor, removeDraft, getAllDraft };
