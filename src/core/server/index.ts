import { RequestHandler, Response } from 'express';
import { App } from 'src/core/app';
import { AppError } from 'src/core/errors';

type Handler = (app: App) => RequestHandler;

const respondWithError = (app: App, res: Response, e: AppError) => {
  if (e.code === 'UNKNOWN_ERROR' || e.errorType === 'Admin auth error')
    app.logger.error(e.originalError, `${e.errorType}: ${e.code}`);

  res.status(e.httpCode);
  res.send({ message: e.message, code: e.code });
};

export type { Handler };
export { respondWithError };
