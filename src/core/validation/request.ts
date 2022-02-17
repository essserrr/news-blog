import { AppError } from 'src/core/errors';
import {
  Pid,
  OptionalPid,
  Name,
  OptionalName,
  SecondName,
  Username,
  Password,
  Avatar,
  AuthToken,
  Description,
  OptionalDescription,
} from 'src/core/database';

import { Validated, NotValidated } from './types';

const validateName = (name: unknown): Name => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateOptionalName = (name: unknown): OptionalName => {
  if (name === undefined) return null;

  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validatePid = (num: unknown): Pid => {
  if (num === null) return null;

  const numParsed = Number(num);
  if (Number.isNaN(numParsed) || numParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });

  return numParsed;
};

const validateOptionalPid = (num: unknown): OptionalPid => {
  if (num === null) return '(null_value)';
  if (num === undefined) return null;

  const numParsed = Number(num);
  if (Number.isNaN(numParsed) || numParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });

  return numParsed;
};

const validateSecondName = (name: unknown): SecondName => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateUsername = (name: unknown): Username => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validatePassword = (name: unknown): Password => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateAvatar = (name: unknown): Avatar => {
  if (name === null) return null;

  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateAuthToken = (name: unknown): AuthToken => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateDescription = (descr: unknown): Description => {
  if (descr === null) return null;

  if (!descr || typeof descr !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return descr;
};

const validateOptionalDescription = (descr: unknown): OptionalDescription => {
  if (descr === null) return '(null_value)';
  if (descr === undefined) return null;

  if (!descr || typeof descr !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return descr;
};

const validators = {
  name: validateName,
  pid: validatePid,
  secondName: validateSecondName,
  username: validateUsername,
  password: validatePassword,
  avatar: validateAvatar,
  authToken: validateAuthToken,
  description: validateDescription,

  optionalName: validateOptionalName,
  optionalPid: validateOptionalPid,
  optionalDescription: validateOptionalDescription,
} as const;

interface ReqRes {
  name: Name;
  optionalName: OptionalName;
  pid: Pid;
  optionalPid: OptionalPid;

  secondName: SecondName;
  username: Username;
  password: Password;
  avatar: Avatar;
  authToken: AuthToken;

  description: Description;
  optionalDescription: OptionalDescription;
}

type ReqParams = NotValidated<ReqRes>;

const validateReq = <T extends ReqParams>(params: T): Validated<T, ReqRes> => {
  const paramsEntries = Object.entries(params) as Array<[keyof Validated<T, ReqRes>, unknown]>;

  return paramsEntries.reduce((sum, [key, value]) => {
    const validator = validators[key];
    if (!validator) throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });

    const validatedValue = validator(value);

    return { ...sum, [key]: validatedValue };
  }, {} as Validated<T, ReqRes>);
};

export { validateReq };
