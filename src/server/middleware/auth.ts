import { RequestHandler, Request } from 'express';
import { AuthStatus } from 'src/core/auth';
import { respondWithError } from 'src/core/server';
import { AppError, getTypedError } from 'src/core/errors';
import { validateQuery, validateReq } from 'src/core/validation';
import { App } from 'src/core/app';

type ProtectedMethods = Record<string, true>;
type AuthMiddleware = (app: App, protectedMethods: ProtectedMethods) => RequestHandler;

// !!!!! cookies based auth
const authenticate = async (app: App, req: Request): Promise<AuthStatus> => {
  const { authToken = '63a5369c-007d-4b1b-ba2a-214ee1cf49b7', uid = '3' } = req.body || {};

  const { uid: uidValidated } = validateQuery({ uid });
  const { authToken: authTokenValidated } = validateReq({ authToken });
  app.logger.debug(`Log in attempt from: ${uidValidated}`);

  const { is_admin: isAdmin, auth_token: targetAuthToken } = await app.db.auth.checkToken(
    uidValidated,
  );

  const tokensMatch = authTokenValidated === targetAuthToken;
  return tokensMatch ? { loggedIn: true, isAdmin, authToken } : { loggedIn: false, isAdmin: false };
};

const authAdminMiddleware: AuthMiddleware = (app, protectedMethods) => async (req, res, next) => {
  try {
    if (!protectedMethods[req.method]) {
      next();
      return;
    }

    const authObject = await authenticate(app, req);
    if (/* !!!!!! !authObject.isAdmin || */ !authObject.loggedIn)
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
