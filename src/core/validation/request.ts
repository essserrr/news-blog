import { AppError } from 'src/core/errors';

import { Validated, NotValidated } from './types';

const validateName = (name: unknown): string => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateOptionalName = (name: unknown): string | null => {
  if (name === undefined) return null;

  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateOptionalPid = (num: unknown): number | null | '(null_value)' => {
  if (num === null) return '(null_value)';
  if (num === undefined) return null;

  const numParsed = Number(num);
  if (Number.isNaN(numParsed) || numParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });

  return numParsed;
};

const validatePid = (num: unknown): number | null => {
  if (num === null) return null;

  const numParsed = Number(num);
  if (Number.isNaN(numParsed) || numParsed < 0)
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });

  return numParsed;
};

const validators = {
  name: validateName,
  optionalName: validateOptionalName,
  pid: validatePid,
  optionalPid: validateOptionalPid,
} as const;

interface ReqRes {
  name: string;
  optionalName: string | null;
  pid: number | null;
  optionalPid: number | null | '(null_value)';
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
