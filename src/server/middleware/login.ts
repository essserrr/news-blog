import { RequestHandler, Request } from 'express';
import { AuthStatus } from 'src/core/auth';
import { respondWithError } from 'src/core/server';
import { AppError } from 'src/core/errors';
import { App } from 'src/core/app';

type ProtectedMethods = Record<string, true>;
type AuthMiddleware = (app: App, protectedMethods: ProtectedMethods) => RequestHandler;

const login = async (app: App, req: Request): Promise<AuthStatus> => {
  const { token } = req.body || {};
  app.logger.debug(`Log in attempt with token: ${token}`);
  return token ? { loggedIn: true, isAdmin: true, token } : { loggedIn: false, isAdmin: false };
};

const loginAdminMiddleware: AuthMiddleware = (app, protectedMethods) => async (req, res, next) => {
  try {
    if (!protectedMethods[req.method]) {
      next();
      return;
    }

    const auth = await login(app, req);
    if (!auth.isAdmin || !auth.loggedIn)
      throw new AppError({ code: 'FORBIDDEN', errorType: 'Admin auth error' });

    res.locals.auth = auth;
    next();
  } catch (e) {
    respondWithError(
      app,
      res,
      new AppError({ code: 'FORBIDDEN', errorType: 'Admin auth error', originalError: e }),
    );
  }
};

export type { AuthMiddleware, ProtectedMethods };
export { loginAdminMiddleware };
