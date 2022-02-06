import { RequestHandler } from 'express';
import { App } from 'src/core/app';

type AuthMiddleware = (app: App, allowed: NoAuthMethods) => RequestHandler;
type NoAuthMethods = Record<string, true>;

const loginMiddleware: AuthMiddleware = (app, allowed) => async (req, res, next) => {
  if (allowed[req.method]) {
    next();
  } else {
    res.sendStatus(404);
  }
};

export type { AuthMiddleware, NoAuthMethods };
export { loginMiddleware };
