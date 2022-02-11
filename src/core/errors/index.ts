import {
  databaseDictionary,
  constraintsDictionary,
  IDatabaseError,
  isDatabaseError,
} from './database-errors';
import { AppError, AppErrorCodes, isAppError } from './AppError';

const processDatabaseError = (e: IDatabaseError): AppError => {
  const terminalCode = databaseDictionary[e.code];
  if (terminalCode && constraintsDictionary[e.constraint]) {
    return new AppError({ code: terminalCode, errorType: 'Database error' });
  }
  return new AppError({
    code: 'UNKNOWN_ERROR',
    errorType: 'Database error',
    originalError: e,
  });
};

const getTypedError = (e: any): AppError => {
  if (isAppError(e)) return e;
  if (isDatabaseError(e)) return processDatabaseError(e);

  return new AppError({ code: 'UNKNOWN_ERROR', originalError: e });
};

export type { AppErrorCodes };
export { getTypedError, AppError };
