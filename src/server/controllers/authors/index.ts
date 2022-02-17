import express from 'express';
import { App } from 'src/core/app';
import { authAdminMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { getAll, get, add, update, remove } from './handlers';

const protectedMethods: ProtectedMethods = {
  GET: true,
  POST: true,
  PATCH: true,
  DELETE: true,
};

const initAuthorRouter = (app: App) => {
  const router = express.Router();

  router.use('/', authAdminMiddleware(app, protectedMethods)).route('/').get(getAll(app));

  router.route('/:id').get(get(app)).post(add(app)).patch(update(app)).delete(remove(app));

  return router;
};

export default initAuthorRouter;
