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

type UserPasswordReq = Pick<UserUnderscored, 'password' | 'auth_token' | 'is_admin'>;
type UserAuthReq = Pick<UserUnderscored, 'auth_token' | 'is_admin' | 'uid'>;

type MappedForeignUser = Omit<User, 'password' | 'authToken' | 'createdAt'>;

const mapForeignUser = ({
  uid,
  name,
  second_name,
  avatar,
  username,
  is_admin,
}: UserUnderscored): MappedForeignUser => ({
  uid,
  name,
  secondName: second_name,
  avatar,
  username,
  isAdmin: is_admin,
});

type MappedSelf = Omit<User, 'password' | 'authToken'>;

const mapSelfUser = ({
  uid,
  name,
  second_name,
  avatar,
  username,
  created_at,
  is_admin,
}: UserUnderscored): MappedSelf => ({
  uid,
  name,
  secondName: second_name,
  avatar,
  username,
  createdAt: created_at,
  isAdmin: is_admin,
});

export type { User, UserUnderscored, UserPasswordReq, UserAuthReq };
export { mapForeignUser, mapSelfUser };
