import { Handler } from 'src/core/server';

const get: Handler = (app) => async (req, res) => {
  const id = String(req.params.id);
  const data = await app.db.tags.get(id);
  res.send({ data });
};

const getAll: Handler = (app) => async (req, res) => {
  const data = await app.db.tags.getAll();
  res.send({ data });
};

const add: Handler = () => async (req, res) => {
  res.send(`ADD ${req.params.id} tag`);
};

const update: Handler = () => async (req, res) => {
  res.send(`UPDATE ${req.params.id} tag`);
};

const remove: Handler = () => async (req, res) => {
  res.send(`DELETE ${req.params.id} tag`);
};

export { add, get, getAll, remove, update };
