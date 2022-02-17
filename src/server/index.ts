import express from 'express';
import { App } from 'src/core/app';
import initTagRouter from './controllers/tags';
import initCategoryRouter from './controllers/category';
import initUsers from './controllers/users';
import initAuth from './controllers/auth';
import initAuthors from './controllers/authors';
import { notFound } from './controllers/not-found';

interface InitServerProps {
  app: App;
}

const initServer = ({ app }: InitServerProps) => {
  const server = express();

  server.use(express.json());

  server.use('/tags', initTagRouter(app));
  server.use('/categories', initCategoryRouter(app));
  server.use('/users', initUsers(app));
  server.use('/auth', initAuth(app));
  server.use('/authors', initAuthors(app));

  server.get('*', notFound(app));

  return server;
};

export type { InitServerProps };
export { initServer };
