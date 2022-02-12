import express from 'express';
import { App } from 'src/core/app';
import { loginAdminMiddleware, NoAuthMethods } from 'src/server/middleware/login';

import { getAll, get, add, update, remove } from './handlers';

const allowedMethods: NoAuthMethods = {
  GET: true,
};

const initCategoryRouter = (app: App) => {
  const router = express.Router();

  router.route('/').get(getAll(app));

  router
    .use('/:id', loginAdminMiddleware(app, allowedMethods))
    .route('/:id')
    .get(get(app))
    .post(add(app))
    .patch(update(app))
    .delete(remove(app));

  return router;
};

export default initCategoryRouter;
