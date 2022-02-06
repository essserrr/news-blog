import express from 'express';
import { loginMiddleware, NoAuthMethods } from 'src/server/middleware/login';
import { App } from 'src/core/app';

import { getAll, get, add, update, remove } from './handlers';

const allowedMethods: NoAuthMethods = {
  GET: true,
};

const initTagRouter = (app: App) => {
  const router = express.Router();

  router.route('/').get(getAll(app));

  router
    .use('/:id', loginMiddleware(app, allowedMethods))
    .route('/:id')
    .get(get(app))
    .post(add(app))
    .patch(update(app))
    .delete(remove(app));

  return router;
};

export default initTagRouter;
