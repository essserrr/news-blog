import { NewsInsertBody, NewsUpdateBody } from 'src/core/remote-client';
import { Handler, respondWithError } from 'src/core/server';
import { getTypedError, AppError } from 'src/core/errors';
import { validateReq, validateQuery } from 'src/core/validation';

const add: Handler = (app) => async (req, res) => {
  try {
    if (res.locals?.auth?.uid !== req.params.id) throw new AppError({ code: 'FORBIDDEN' });

    const { uid } = validateQuery({ uid: req.params.id });

    const { title, content, category, tags, mainImage, auxImages }: NewsInsertBody = req.body || {};
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

    const data = await app.db.news.add({
      author: uid,
      title: validatedTitle,
      content: validatedContent,
      category: validatedCategoryId,
      tags: validatedTagIds,
      mainImage: validatedMainImage,
      auxImages: validatedAuxImages,
    });

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const get: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });

    const data = await app.db.news.get(uid);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const update: Handler = (app) => async (req, res) => {
  try {
    const { author, title, content, category, tags, mainImage, auxImages }: NewsUpdateBody =
      req.body || {};
    if (res.locals?.auth?.uid !== author) throw new AppError({ code: 'FORBIDDEN' });

    const { uid: nid } = validateQuery({ uid: req.params.id });
    const { uid: authorValidated } = validateQuery({ uid: author });
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

    const data = await app.db.news.update(nid, {
      author: authorValidated,
      title: validatedTitle,
      content: validatedContent,
      category: validatedCategoryId,
      tags: validatedTagIds,
      mainImage: validatedMainImage,
      auxImages: validatedAuxImages,
    });

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { add, get, update };
