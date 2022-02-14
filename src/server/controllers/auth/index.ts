import express from 'express';
import { App } from 'src/core/app';
import { loginMiddleware, ProtectedMethods } from 'src/server/middleware/login';
import { authMiddleware } from 'src/server/middleware/auth';

import { logout, login } from './handlers';

const protectedWithLogin: ProtectedMethods = {
  POST: true,
};

const protectedWithAuth: ProtectedMethods = {
  DELETE: true,
};

const initCategoryRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', loginMiddleware(app, protectedWithLogin), authMiddleware(app, protectedWithAuth))
    .route('/:id')
    .post(login(app))
    .delete(logout(app));

  return router;
};

export default initCategoryRouter;
