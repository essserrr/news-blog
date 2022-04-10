import type { DatabaseOptionalValue } from '.';

// fields
type Id = number;
type Name = string;
type OptionalName = DatabaseOptionalValue<Name>;
type Pid = number | null;
type OptionalPid = DatabaseOptionalValue<Pid>;

type Uid = string;
type SecondName = string;
type Avatar = string | null;
type Username = string;
type Password = string;
type CreatedAt = number;
type IsAdmin = boolean;
type AuthToken = string | null;

type Description = string | null;
type OptionalDescription = DatabaseOptionalValue<Description>;

type Title = string;
type Content = string;
type Image = string;

// params
type Offset = number;
type Limit = number | null;

type DateString = string;
type SortingType = 'asc' | 'desc';

export type {
  Id,
  Name,
  OptionalName,
  Pid,
  OptionalPid,
  Offset,
  Limit,
  Uid,
  SecondName,
  Avatar,
  Username,
  Password,
  CreatedAt,
  IsAdmin,
  AuthToken,
  Description,
  OptionalDescription,
  Title,
  Content,
  Image,
  SortingType,
  DateString,
};
