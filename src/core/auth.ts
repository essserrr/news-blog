type AuthStatus = {
  loggedIn: boolean;
  isAdmin: boolean;
  uid?: string;
  authToken?: string | null;
};

export type { AuthStatus };
