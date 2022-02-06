import { Handler } from 'src/core/server';
import { TagUpdate } from 'src/core/tags';

const validateId = (id: unknown): string => {
  if (!id || typeof id !== 'string') throw new Error('Wrong Id');
  return id;
};

const validateName = (id: unknown): string => {
  if (!id || typeof id !== 'string') throw new Error('Wrong name');
  return id;
};

const getAll: Handler = (app) => async (req, res) => {
  try {
    const data = (await app.db.tags.getAll()) || [];
    res.send({ data });
  } catch (e) {
    app.logger.error(e);
    res.sendStatus(500);
  }
};

const get: Handler = (app) => async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const data = (await app.db.tags.get(id)) || {};
    res.send({ data });
  } catch (e) {
    app.logger.error(e);
    res.sendStatus(500);
  }
};

const add: Handler = (app) => async (req, res) => {
  try {
    const name = validateName(req.params.id);
    const data = (await app.db.tags.add(name)) || {};
    res.send({ data });
  } catch (e) {
    app.logger.error(e);
    res.sendStatus(500);
  }
};

const update: Handler = (app) => async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const { name }: TagUpdate = req.body;
    const validatedName = validateName(name);

    const data = (await app.db.tags.update(id, validatedName)) || {};
    res.send({ data });
  } catch (e) {
    app.logger.error(e);
    res.sendStatus(500);
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const id = validateId(req.params.id);

    const data = (await app.db.tags.remove(id)) || {};
    res.send({ data });
  } catch (e) {
    app.logger.error(e);
    res.sendStatus(500);
  }
};

export { add, get, getAll, remove, update };
