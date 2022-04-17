import { DraftInsertBody } from 'src/core/remote-client';
import { mapNews } from 'src/core/news';
import { Handler, respondWithError } from 'src/core/server';
import { getTypedError, AppError } from 'src/core/errors';
import { validateReq, validateQuery } from 'src/core/validation';

const add: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });
    if (res.locals?.auth?.uid !== uid) throw new AppError({ code: 'FORBIDDEN' });

    const { title, content, category, tags, mainImage, auxImages }: DraftInsertBody =
      req.body || {};
    const {
      title: validatedTitle,
      content: validatedContent,
      categoryId: validatedCategoryId,
      tagIds: validatedTagIds,
      mainImage: validatedMainImage,
      auxImages: validatedAuxImages,
    } = validateReq({
      title,
      content,
      categoryId: category,
      tagIds: tags,
      mainImage,
      auxImages,
    });

    const data = await app.db.drafts.add({
      author: uid,
      title: validatedTitle,
      content: validatedContent,
      category: validatedCategoryId,
      tags: validatedTagIds,
      mainImage: validatedMainImage,
      auxImages: validatedAuxImages,
    });

    res.send({ data: mapNews(data) });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const get: Handler = (app) => async (req, res) => {
  try {
    const { uid: nid } = validateQuery({ uid: req.params.id });

    const { author: authorUid } = await app.db.drafts.checkAuthor(nid);
    const { uid } = validateQuery({ uid: authorUid });
    if (res.locals?.auth?.uid !== uid) throw new AppError({ code: 'FORBIDDEN' });

    const data = await app.db.drafts.get(nid);

    res.send({ data: mapNews(data) });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const update: Handler = (app) => async (req, res) => {
  try {
    const { uid: nid } = validateQuery({ uid: req.params.id });

    const { author: authorUid } = await app.db.drafts.checkAuthor(nid);
    const { uid } = validateQuery({ uid: authorUid });
    if (res.locals?.auth?.uid !== uid) throw new AppError({ code: 'FORBIDDEN' });

    const { title, content, category, tags, mainImage, auxImages }: DraftInsertBody =
      req.body || {};

    const {
      title: validatedTitle,
      content: validatedContent,
      categoryId: validatedCategoryId,
      tagIds: validatedTagIds,
      mainImage: validatedMainImage,
      auxImages: validatedAuxImages,
    } = validateReq({
      title,
      content,
      categoryId: category,
      tagIds: tags,
      mainImage,
      auxImages,
    });

    const data = await app.db.drafts.update(nid, {
      author: uid,
      title: validatedTitle,
      content: validatedContent,
      category: validatedCategoryId,
      tags: validatedTagIds,
      mainImage: validatedMainImage,
      auxImages: validatedAuxImages,
    });

    res.send({ data: mapNews(data) });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const { uid: nid } = validateQuery({ uid: req.params.id });

    const { author: authorUid } = await app.db.drafts.checkAuthor(nid);
    const { uid } = validateQuery({ uid: authorUid });
    if (res.locals?.auth?.uid !== uid) throw new AppError({ code: 'FORBIDDEN' });

    const data = await app.db.drafts.remove(nid, uid);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const getAll: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: res.locals?.auth?.uid });

    const { offset = 0, limit = null } = req.query;

    const { offset: validatedOffset, limit: validatedLimit } = validateQuery({ offset, limit });

    const data = await app.db.drafts.getAll({
      offset: validatedOffset,
      limit: validatedLimit,
      filter: { type: 'author', value: uid, isDraft: true },
      sorting: { type: 'date', sorting: 'desc' },
    });

    res.send({ data: { ...data, data: data.data.map((n) => mapNews(n)) } });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { add, get, update, remove, getAll };
