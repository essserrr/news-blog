import express from 'express';
import { App } from 'src/core/app';
import { authMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { getAll, add, remove } from './handlers';

const protectedMethods: ProtectedMethods = {
  POST: true,
  DELETE: true,
};

const initCommentsRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', authMiddleware(app, protectedMethods))
    .route('/:id')
    .get(getAll(app))
    .post(add(app))
    .delete(remove(app));

  return router;
};

export default initCommentsRouter;
