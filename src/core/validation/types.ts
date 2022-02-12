type Validated<T, B> = Pick<B, Extract<keyof B, keyof T>>;
type NotValidated<T> = { [K in keyof T]?: unknown };

export type { Validated, NotValidated };
