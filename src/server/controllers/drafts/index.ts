import express from 'express';
import { App } from 'src/core/app';
import { authMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { add, get, update, remove, getAll } from './handlers';

const protectedMethods: ProtectedMethods = {
  POST: true,
  PUT: true,
  DELETE: true,
};

const initDraftsRouter = (app: App) => {
  const router = express.Router();

  router.use('/', authMiddleware(app, protectedMethods)).route('/').get(getAll(app));

  router.route('/:id').get(get(app)).put(update(app)).post(add(app)).delete(remove(app));

  return router;
};

export default initDraftsRouter;
