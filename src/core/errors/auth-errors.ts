type AuthErrorCodes = 'FORBIDDEN' | 'UNAUTHORIZED';

const authErrorHttpCodes: Record<AuthErrorCodes, number> = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

export { authErrorHttpCodes };
export type { AuthErrorCodes };
