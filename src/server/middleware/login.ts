import { Request } from 'express';
import { compare } from 'bcrypt';

import { AuthStatus } from 'src/core/auth';
import { respondWithError } from 'src/core/server';
import { AppError, getTypedError } from 'src/core/errors';
import { App } from 'src/core/app';
import { validateQuery, validateReq } from 'src/core/validation';

import type { AuthMiddleware, ProtectedMethods } from './auth';

const login = async (app: App, req: Request): Promise<AuthStatus> => {
  const { username } = validateQuery({ username: req.params.id });

  const { password } = req.body || {};
  const { password: passwordValidated } = validateReq({ password });
  app.logger.debug(`Log in attempt from: ${username}`);

  const {
    is_admin: isAdmin,
    auth_token: authToken,
    password: targetPassword,
    uid: targetUid,
  } = await app.db.auth.checkPass(username);

  const passwordsMatch = await compare(passwordValidated, targetPassword);
  return passwordsMatch
    ? { loggedIn: true, isAdmin, authToken, uid: targetUid }
    : { loggedIn: false, isAdmin: false };
};

const loginMiddleware: AuthMiddleware = (app, protectedMethods) => async (req, res, next) => {
  try {
    if (!protectedMethods[req.method]) {
      next();
      return;
    }

    const authObject = await login(app, req);
    if (!authObject.loggedIn) throw new AppError({ code: 'NOT_FOUND', errorType: 'Auth error' });

    res.locals.auth = authObject;
    next();
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export type { AuthMiddleware, ProtectedMethods };
export { loginMiddleware };
