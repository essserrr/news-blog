import express from 'express';
import cookieParser from 'cookie-parser';

import { App } from 'src/core/app';
import { AppError } from 'src/core/errors';

import initTagRouter from './controllers/tags';
import initCategoryRouter from './controllers/category';
import initUsers from './controllers/users';
import initAuth from './controllers/auth';
import initAuthors from './controllers/authors';
import initNews from './controllers/news';
import initCommentsRouter from './controllers/comments';
import { notFound } from './controllers/not-found';

interface InitServerProps {
  app: App;
  secretKey: string | undefined;
}

const initServer = ({ app, secretKey }: InitServerProps) => {
  if (!secretKey)
    throw new AppError({ message: 'Server config: No secret key', code: 'WRONG_FORMAT' });

  const server = express();

  server.use(express.json());
  server.use(cookieParser(secretKey));

  server.use('/tags', initTagRouter(app));
  server.use('/categories', initCategoryRouter(app));
  server.use('/users', initUsers(app));
  server.use('/auth', initAuth(app));
  server.use('/authors', initAuthors(app));
  server.use('/news', initNews(app));
  server.use('/comments', initCommentsRouter(app));

  server.get('*', notFound(app));

  return server;
};

export type { InitServerProps };
export { initServer };
