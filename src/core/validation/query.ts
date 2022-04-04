import { BigNumber } from 'bignumber.js';
import { Limit, Offset, Id, Uid, Username } from 'src/core/database';
import { AppError } from 'src/core/errors';

import { Validated, NotValidated } from './types';

const validateId = (id: unknown): Id => {
  const idParsed = Number(id);
  if (Number.isNaN(idParsed) || idParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return idParsed;
};

const validateOffset = (num: unknown): Offset => {
  const numParsed = Number(num);
  if (Number.isNaN(numParsed) || numParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return numParsed;
};

const validateLimit = (num: unknown): Limit => {
  if (num === null || num === 'null') return null;
  const numParsed = Number(num);
  if (Number.isNaN(numParsed) || numParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return numParsed;
};

const validateUid = (uid: unknown): Uid => {
  if (!uid || typeof uid !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  if (new BigNumber(uid).isNaN())
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return uid;
};

const validateUsername = (name: unknown): Username => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateString = (str: unknown): string => {
  if (!str || typeof str !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return str;
};

const validateDate = (str: unknown): string => {
  if (!str || typeof str !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  if (!/\d{4,4}-\d{2,2}-\d{2,2}/.test(str))
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return str;
};

const validators = {
  limit: validateLimit,
  offset: validateOffset,
  id: validateId,
  uid: validateUid,
  username: validateUsername,
  string: validateString,
  date: validateDate,
} as const;

interface QueryRes {
  id: Id;
  offset: Offset;
  limit: Limit;
  uid: Uid;
  username: Username;
  string: string;
  date: string;
}

type QueryParams = NotValidated<QueryRes>;

const validateQuery = <T extends QueryParams>(params: T): Validated<T, QueryRes> => {
  const paramsEntries = Object.entries(params) as Array<[keyof Validated<T, QueryRes>, unknown]>;

  return paramsEntries.reduce((sum, [key, value]) => {
    const validator = validators[key];
    if (!validator) throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });

    const validatedValue = validator(value);

    return { ...sum, [key]: validatedValue };
  }, {} as Validated<T, QueryRes>);
};

export { validateQuery };
