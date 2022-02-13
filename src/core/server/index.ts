import { RequestHandler, Response } from 'express';
import { App } from 'src/core/app';
import { AppError } from 'src/core/errors';
import { UserUnderscored, User } from 'src/core/user';

type Handler = (app: App) => RequestHandler;

type MappedUser = Omit<User, 'password' | 'authToken'>;

const mapUser = ({
  uid,
  name,
  second_name,
  avatar,
  username,
  created_at,
  is_admin,
}: UserUnderscored): MappedUser => ({
  uid,
  name,
  secondName: second_name,
  avatar,
  username,
  createdAt: created_at,
  isAdmin: is_admin,
});

type MappedSelf = Omit<User, 'password'>;

const mapSelfUser = ({
  uid,
  name,
  second_name,
  avatar,
  username,
  created_at,
  is_admin,
  auth_token,
}: UserUnderscored): MappedSelf => ({
  uid,
  name,
  secondName: second_name,
  avatar,
  username,
  createdAt: created_at,
  isAdmin: is_admin,
  authToken: auth_token,
});

const respondWithError = (app: App, res: Response, e: AppError) => {
  if (e.code === 'UNKNOWN_ERROR' || e.errorType === 'Admin auth error')
    app.logger.error(e.originalError, `${e.errorType}: ${e.code}`);

  res.status(e.httpCode);
  res.send({ message: e.message, code: e.code });
};

export type { Handler };
export { respondWithError, mapUser, mapSelfUser };
