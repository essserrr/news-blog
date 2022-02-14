import express from 'express';
import { App } from 'src/core/app';
import { loginAdminMiddleware, ProtectedMethods } from 'src/server/middleware/login';

import { get, signup, remove } from './handlers';

const protectedMethods: ProtectedMethods = {
  DELETE: true,
};

const initUsersRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', loginAdminMiddleware(app, protectedMethods))
    .route('/:id')
    .get(get(app))
    .post(signup(app))
    .delete(remove(app));

  return router;
};

export default initUsersRouter;
