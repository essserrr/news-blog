import { IS_PRODUCTION } from 'src/config';

enum AuthCookies {
  UID = 'uid',
  AUTH_TOKEN = 'auth_token',
}

const authOptions = {
  path: '/',
  signed: true,
  sameSite: true,
  httpOnly: true,
  secure: IS_PRODUCTION,
  maxAge: 2147483647,
} as const;

export { AuthCookies, authOptions };
