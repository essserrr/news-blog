import http from 'http';
import { App } from 'src/core/app';

const okResponseHeaders = { 'Content-Type': 'application/json' };

const handleStatus =
  ({ app }: InitServerProps) =>
  async (res: http.ServerResponse) => {
    try {
      app.logger.debug('Got status request');

      const tags = await app.db.tags.getAll();

      const json = JSON.stringify({ data: tags });

      res.writeHead(200, okResponseHeaders);
      res.end(json);
    } catch (e) {
      app.logger.debug(e, 'Request handler error');
      res.writeHead(500);
      res.end();
    }
  };

interface InitServerProps {
  app: App;
}

const initServer = (props: InitServerProps) => {
  const server = http.createServer();

  server.on('request', (req, res) => {
    if (req.url === '/tags') {
      handleStatus(props)(res);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  return server;
};

export type { InitServerProps };
export { initServer, handleStatus, okResponseHeaders };
