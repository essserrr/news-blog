import { RequestHandler, Request } from 'express';
import { AuthStatus } from 'src/core/auth';
import { App } from 'src/core/app';

type AuthMiddleware = (app: App, allowed: NoAuthMethods) => RequestHandler;
type NoAuthMethods = Record<string, true>;

const login = async (app: App, req: Request): Promise<AuthStatus> => {
  const { token } = req.body || {};
  app.logger.debug(`Log in attempt with token: ${token}`);
  return token ? { loggedIn: true, isAdmin: true, token } : { loggedIn: false, isAdmin: false };
};

const loginAdminMiddleware: AuthMiddleware = (app, allowed) => async (req, res, next) => {
  if (allowed[req.method]) {
    next();
  } else {
    const auth = await login(app, req);
    if (auth.isAdmin && auth.loggedIn) {
      res.locals.auth = auth;
      next();
    } else {
      res.sendStatus(404);
    }
  }
};

export type { AuthMiddleware, NoAuthMethods };
export { loginAdminMiddleware };
