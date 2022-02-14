import { RequestHandler, Request } from 'express';
import { AuthStatus } from 'src/core/auth';
import { respondWithError } from 'src/core/server';
import { AppError, getTypedError } from 'src/core/errors';
import { App } from 'src/core/app';

type ProtectedMethods = Record<string, true>;
type AuthMiddleware = (app: App, protectedMethods: ProtectedMethods) => RequestHandler;

const authenticate = async (app: App, req: Request): Promise<AuthStatus> => {
  const { token: authToken } = req.body || {};
  app.logger.debug(`Log in attempt with token: ${authToken}`);
  return authToken
    ? { loggedIn: true, isAdmin: true, authToken }
    : { loggedIn: false, isAdmin: false };
};

const authAdminMiddleware: AuthMiddleware = (app, protectedMethods) => async (req, res, next) => {
  try {
    if (!protectedMethods[req.method]) {
      next();
      return;
    }

    const authObject = await authenticate(app, req);
    if (!authObject.isAdmin || !authObject.loggedIn)
      throw new AppError({ code: 'FORBIDDEN', errorType: 'Admin auth error' });

    res.locals.auth = authObject;
    next();
  } catch (e) {
    respondWithError(
      app,
      res,
      new AppError({ code: 'FORBIDDEN', errorType: 'Admin auth error', originalError: e }),
    );
  }
};

const authMiddleware: AuthMiddleware = (app, protectedMethods) => async (req, res, next) => {
  try {
    if (!protectedMethods[req.method]) {
      next();
      return;
    }

    const authObject = await authenticate(app, req);
    if (!authObject.loggedIn) throw new AppError({ code: 'FORBIDDEN', errorType: 'Auth error' });

    res.locals.auth = authObject;
    next();
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export type { AuthMiddleware, ProtectedMethods };
export { authAdminMiddleware, authMiddleware };
