import { Handler, respondWithError } from 'src/core/server';
import { TagUpdate } from 'src/core/tags';
import { getTypedError } from 'src/core/errors';
import { validateId, validateName, validateLimit, validateOffset } from 'src/core/validation';

const getAll: Handler = (app) => async (req, res) => {
  try {
    const { offset = 0, limit = null } = req.query;

    const validatedOffset = validateOffset(offset);
    const validatedLimit = validateLimit(limit);

    const data = await app.db.tags.getAll(validatedOffset, validatedLimit);
    res.send({ data });
  } catch (e) {
    app.logger.error(e);
    res.sendStatus(500);
  }
};

const get: Handler = (app) => async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const data = await app.db.tags.get(id);
    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const add: Handler = (app) => async (req, res) => {
  try {
    const name = validateName(req.params.id);
    const data = await app.db.tags.add(name);
    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const update: Handler = (app) => async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const { name }: TagUpdate = req.body;
    const validatedName = validateName(name);

    const data = await app.db.tags.update(id, validatedName);
    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const id = validateId(req.params.id);

    const data = await app.db.tags.remove(id);
    res.send(data);
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { add, get, getAll, remove, update };
