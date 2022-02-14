import express from 'express';
import { App } from 'src/core/app';
import { authAdminMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { get, signup, remove } from './handlers';

const protectedMethods: ProtectedMethods = {
  DELETE: true,
};

const initUsersRouter = (app: App) => {
  const router = express.Router();

  router
    .use('/:id', authAdminMiddleware(app, protectedMethods))
    .route('/:id')
    .get(get(app))
    .post(signup(app))
    .delete(remove(app));

  return router;
};

export default initUsersRouter;
