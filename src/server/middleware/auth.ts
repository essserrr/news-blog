import { RequestHandler, Request } from 'express';

import { AuthStatus } from 'src/core/auth';
import { respondWithError } from 'src/core/server';
import { AppError, getTypedError } from 'src/core/errors';
import { validateQuery, validateReq } from 'src/core/validation';
import { AuthCookies } from 'src/core/cookies-session';

import { App } from 'src/core/app';

type ProtectedMethods = Record<string, true>;
type AuthMiddleware = (app: App, protectedMethods: ProtectedMethods) => RequestHandler;

const authenticate = async (app: App, req: Request): Promise<AuthStatus> => {
  const { [AuthCookies.AUTH_TOKEN]: authToken, [AuthCookies.UID]: uid } = req.signedCookies || {};

  const { uid: uidValidated } = validateQuery({ uid });
  const { authToken: authTokenValidated } = validateReq({ authToken });
  app.logger.debug(`Log in attempt from: ${uidValidated}`);

  const {
    is_admin: isAdmin,
    auth_token: targetAuthToken,
    uid: targetUid,
  } = await app.db.auth.checkToken(uidValidated);

  const tokensMatch = authTokenValidated === targetAuthToken;
  return tokensMatch
    ? { loggedIn: true, isAdmin, authToken, uid: targetUid }
    : { loggedIn: false, isAdmin: false };
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
