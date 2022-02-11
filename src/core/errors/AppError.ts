import { databaseErrorHttpErrors, DatabaseErrorCodes } from './database-errors';
import { authErrorHttpCodes, AuthErrorCodes } from './auth-errors';
import { generalErrorHttpCode, GeneralErrorCodes } from './general-errors';

type ErrorTypes = 'Database error' | 'App error' | 'Auth error' | 'Admin auth error';
type AppErrorCodes = GeneralErrorCodes | DatabaseErrorCodes | AuthErrorCodes;

const errorStrings: Record<AppErrorCodes, string> = {
  NOT_FOUND: 'Not found',
  UNKNOWN_ERROR: 'Internal server error',
  NAME_CONFLICT: 'Names conflict',
  FORBIDDEN: 'Access forbidden',
  UNAUTHORIZED: 'Authorization needed',
};

const appErrorHttpCodes = {
  ...generalErrorHttpCode,
  ...databaseErrorHttpErrors,
  ...authErrorHttpCodes,
};

interface IAppErrorProps {
  code: AppErrorCodes;
  message?: string;
  errorType?: ErrorTypes;
  originalError?: unknown;
}

class AppError extends Error {
  code: AppErrorCodes;

  httpCode: number;

  message: string;

  errorType: ErrorTypes;

  originalError?: unknown;

  constructor({ code, originalError, message, errorType = 'App error' }: IAppErrorProps) {
    super();
    const isAdminAuth = errorType === 'Admin auth error';
    const safeCode = isAdminAuth ? 'NOT_FOUND' : code;

    this.code = safeCode;
    this.httpCode = appErrorHttpCodes[safeCode];

    this.message = message ?? errorStrings[safeCode];
    this.errorType = errorType;

    this.originalError = originalError;
  }
}

const isAppError = (e: any): e is AppError => e instanceof AppError;

export type { AppErrorCodes };
export { AppError, isAppError };
