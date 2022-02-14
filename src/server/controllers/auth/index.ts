import express from 'express';
import { App } from 'src/core/app';
import { loginMiddleware, ProtectedMethods } from 'src/server/middleware/login';

import { logout, login } from './handlers';

const protectedWithLogin: ProtectedMethods = {
  POST: true,
};

const initCategoryRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', loginMiddleware(app, protectedWithLogin))
    .route('/:id')
    .post(login(app))
    .delete(logout(app));

  return router;
};

export default initCategoryRouter;
