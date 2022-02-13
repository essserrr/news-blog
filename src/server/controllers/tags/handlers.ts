import { TagBody } from 'src/core/remote-client';
import { Handler, respondWithError } from 'src/core/server';
import { getTypedError } from 'src/core/errors';
import { validateReq, validateQuery } from 'src/core/validation';

const getAll: Handler = (app) => async (req, res) => {
  try {
    const { offset = 0, limit = null } = req.query;
    const { offset: validatedOffset, limit: validatedLimit } = validateQuery({ offset, limit });
    const data = await app.db.tags.getAll(validatedOffset, validatedLimit);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const get: Handler = (app) => async (req, res) => {
  try {
    const { id } = validateQuery({ id: req.params.id });
    const data = await app.db.tags.get(id);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const add: Handler = (app) => async (req, res) => {
  try {
    const { name } = validateReq({ name: req.params.id });
    const data = await app.db.tags.add({ name });

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const update: Handler = (app) => async (req, res) => {
  try {
    const { id } = validateQuery({ id: req.params.id });

    const { name }: TagBody = req.body;
    const { name: validatedName } = validateReq({ name });

    const data = await app.db.tags.update(id, { name: validatedName });
    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const { id } = validateQuery({ id: req.params.id });
    const data = await app.db.tags.remove(id);

    res.send(data);
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { add, get, getAll, remove, update };
