import express from 'express';
import { App } from 'src/core/app';
import { authMiddleware, ProtectedMethods } from 'src/server/middleware/auth';

import { add } from './handlers';

const protectedMethods: ProtectedMethods = {
  POST: true,
};

const initNewsRouter = (app: App) => {
  const router = express.Router();

  router.use('/:id', authMiddleware(app, protectedMethods)).route('/:id').post(add(app));

  return router;
};

export default initNewsRouter;
