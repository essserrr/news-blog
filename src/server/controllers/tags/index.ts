import express from 'express';
import { App } from 'src/core/app';
import { authAdminMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { getAll, get, add, update, remove } from './handlers';

const protectedMethods: ProtectedMethods = {
  POST: true,
  PATCH: true,
  DELETE: true,
};

const initTagRouter = (app: App) => {
  const router = express.Router();

  router.route('/').get(getAll(app));

  router
    .use('/:id', authAdminMiddleware(app, protectedMethods))
    .route('/:id')
    .get(get(app))
    .post(add(app))
    .patch(update(app))
    .delete(remove(app));

  return router;
};

export default initTagRouter;
