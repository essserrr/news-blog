import express from 'express';
import { App } from 'src/core/app';
import initTagRouter from './controllers/tags';
import initCategoryRouter from './controllers/category';

interface InitServerProps {
  app: App;
}

const initServer = ({ app }: InitServerProps) => {
  const server = express();

  server.use(express.json());

  server.use('/tags', initTagRouter(app));
  server.use('/categories', initCategoryRouter(app));

  return server;
};

export type { InitServerProps };
export { initServer };
