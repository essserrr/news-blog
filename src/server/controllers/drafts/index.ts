import express from 'express';
import { App } from 'src/core/app';
import { authMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { add, get, update, remove, getAll } from './handlers';

const protectedMethods: ProtectedMethods = {
  /* POST: true,
  PUT: true,
  DELETE: true, */
};

const initDraftsRouter = (app: App) => {
  const router = express.Router();

  router.route('/').get(getAll(app));

  router
    .use('/:id', authMiddleware(app, protectedMethods))
    .route('/:id')
    .get(get(app))
    .put(update(app))
    .post(add(app))
    .delete(remove(app));

  return router;
};

export default initDraftsRouter;
