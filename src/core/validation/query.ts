import { Limit, Offset } from 'src/core/database';
import { AppError } from 'src/core/errors';

import { Validated, NotValidated } from './types';

const validateId = (id: unknown): number => {
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

const validators = {
  limit: validateLimit,
  offset: validateOffset,
  id: validateId,
} as const;

interface QueryRes {
  id: number;
  offset: Offset;
  limit: Limit;
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
