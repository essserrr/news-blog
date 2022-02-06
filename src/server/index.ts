import express from 'express';
import { App } from 'src/core/app';
import initTagRouter from './controllers/tags';

interface InitServerProps {
  app: App;
}

const initServer = ({ app }: InitServerProps) => {
  const server = express();

  server.use(express.json());

  server.use('/tags', initTagRouter(app));

  return server;
};

export type { InitServerProps };
export { initServer };
