import { AuthorInsertBody, AuthorUpdateBody } from 'src/core/remote-client';
import { Handler, respondWithError } from 'src/core/server';
import { getTypedError } from 'src/core/errors';
import { validateReq, validateQuery } from 'src/core/validation';

const getAll: Handler = (app) => async (req, res) => {
  try {
    const { offset = 0, limit = null } = req.query;
    const { offset: validatedOffset, limit: validatedLimit } = validateQuery({ offset, limit });
    const data = await app.db.authors.getAll(validatedOffset, validatedLimit);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const get: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });
    const data = await app.db.authors.get(uid);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const add: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });

    const { description }: AuthorInsertBody = req.body || {};
    const { description: validatedDescription } = validateReq({
      description,
    });

    const data = await app.db.authors.add({ uid, description: validatedDescription });

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const update: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });

    const { description }: AuthorUpdateBody = req.body || {};
    const { optionalDescription } = validateReq({
      optionalDescription: description,
    });

    const data = await app.db.authors.update(uid, { description: optionalDescription });
    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });
    const data = await app.db.authors.remove(uid);

    res.send(data);
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { add, get, getAll, remove, update };
