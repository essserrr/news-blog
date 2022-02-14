type AuthStatus = {
  loggedIn: boolean;
  isAdmin: boolean;
  authToken?: string | null;
};

export type { AuthStatus };
