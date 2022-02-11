import { Handler, respondWithError } from 'src/core/server';
import { Limit, Offset } from 'src/core/database';
import { TagUpdate } from 'src/core/tags';
import { getTypedError } from 'src/core/errors';

const validateId = (id: unknown): string => {
  if (!id || typeof id !== 'string') throw new Error('Wrong Id');
  return id;
};

const validateName = (name: unknown): string => {
  if (!name || typeof name !== 'string') throw new Error('Wrong name');
  return name;
};

const validateOffset = (num: unknown): Offset => {
  const numParsed = Number(num);
  if (Number.isNaN(numParsed)) throw new Error('Wrong offset');
  return numParsed;
};

const validateLimit = (num: unknown): Limit => {
  if (num === null) return num;
  const numParsed = Number(num);
  if (Number.isNaN(numParsed)) throw new Error('Wrong limit');
  return numParsed;
};

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
