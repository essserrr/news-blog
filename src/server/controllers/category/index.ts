import express from 'express';
import { App } from 'src/core/app';
import { loginAdminMiddleware, ProtectedMethods } from 'src/server/middleware/login';

import { getAll, get, add, update, remove } from './handlers';

const protectedMethods: ProtectedMethods = {
  POST: true,
  PATCH: true,
  DELETE: true,
};

const initCategoryRouter = (app: App) => {
  const router = express.Router();

  router.route('/').get(getAll(app));

  router
    .use('/:id', loginAdminMiddleware(app, protectedMethods))
    .route('/:id')
    .get(get(app))
    .post(add(app))
    .patch(update(app))
    .delete(remove(app));

  return router;
};

export default initCategoryRouter;
