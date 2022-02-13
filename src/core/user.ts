interface User {
  uid: string;
  name: string;
  secondName: string;
  avatar: string | null;
  username: string;
  password: string;
  createdAt: string;
  isAdmin: boolean;
  authToken: string | null;
}

interface UserUnderscored {
  uid: string;
  name: string;
  second_name: string;
  avatar: string | null;
  username: string;
  password: string;
  created_at: string;
  is_admin: boolean;
  auth_token: string | null;
}

export type { User, UserUnderscored };
