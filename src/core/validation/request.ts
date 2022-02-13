import { AppError } from 'src/core/errors';
import { Pid, OptionalPid, Name, OptionalName } from 'src/core/database';

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

const validators = {
  name: validateName,
  optionalName: validateOptionalName,
  pid: validatePid,
  optionalPid: validateOptionalPid,
} as const;

interface ReqRes {
  name: Name;
  optionalName: OptionalName;
  pid: Pid;
  optionalPid: OptionalPid;
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
