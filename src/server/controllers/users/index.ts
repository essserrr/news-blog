import express from 'express';
import { App } from 'src/core/app';
import { loginAdminMiddleware, NoAuthMethods } from 'src/server/middleware/login';

import { get, signup, remove } from './handlers';

const allowedMethods: NoAuthMethods = {
  GET: true,
  POST: true,
};

const initCategoryRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', loginAdminMiddleware(app, allowedMethods))
    .route('/:id')
    .get(get(app))
    .post(signup(app))
    .delete(remove(app));

  return router;
};

export default initCategoryRouter;
