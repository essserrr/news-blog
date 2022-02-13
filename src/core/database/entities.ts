import type { DatabaseOptionalValue } from '.';

// fields
type Id = number;
type Name = string;
type OptionalName = DatabaseOptionalValue<Name>;
type Pid = number | null;
type OptionalPid = DatabaseOptionalValue<Pid>;

// params
type Offset = number;
type Limit = number | null;

export type { Id, Name, OptionalName, Pid, OptionalPid, Offset, Limit };
