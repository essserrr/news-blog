import express from 'express';
import { App } from 'src/core/app';
import { loginAdminMiddleware, ProtectedMethods } from 'src/server/middleware/login';

import { logout, login } from './handlers';

const protectedMethods: ProtectedMethods = {
  DELETE: true,
};
const initCategoryRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', loginAdminMiddleware(app, protectedMethods))
    .route('/:id')
    .post(login(app))
    .delete(logout(app));

  return router;
};

export default initCategoryRouter;
