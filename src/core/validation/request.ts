import { AppError } from 'src/core/errors';

import { Validated, NotValidated } from './types';

const validateName = (name: unknown): string => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validators = {
  name: validateName,
} as const;

interface ReqRes {
  name: string;
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
