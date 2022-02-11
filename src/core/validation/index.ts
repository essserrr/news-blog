import { Limit, Offset } from 'src/core/database';
import { AppError } from 'src/core/errors';

const validateId = (id: unknown): number => {
  const idParsed = Number(id);
  if (Number.isNaN(idParsed))
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return idParsed;
};

const validateName = (name: unknown): string => {
  if (!name || typeof name !== 'string')
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return name;
};

const validateOffset = (num: unknown): Offset => {
  const numParsed = Number(num);
  if (Number.isNaN(numParsed))
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return numParsed;
};

const validateLimit = (num: unknown): Limit => {
  if (num === null) return num;
  const numParsed = Number(num);
  if (Number.isNaN(numParsed))
    throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  return numParsed;
};

export { validateId, validateName, validateOffset, validateLimit };
