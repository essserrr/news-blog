type DatabaseErrorCodes = 'NAME_CONFLICT';
type KnownConstraints = 'name_lower_unique';

interface IDatabaseError {
  message: string;
  length: number;
  name: string;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}

const databaseDictionary: Record<string, DatabaseErrorCodes> = {
  '23505': 'NAME_CONFLICT',
};

const constraintsDictionary: Record<string, KnownConstraints> = {
  name_lower_unique: 'name_lower_unique',
};

const isDatabaseError = (e: any): e is IDatabaseError => {
  if (!e || typeof e !== 'object') return false;
  if (typeof e.schema !== 'string' || typeof e.table !== 'string') return false;
  return true;
};

const databaseErrorHttpErrors: Record<DatabaseErrorCodes, number> = { NAME_CONFLICT: 409 };

export type { DatabaseErrorCodes, IDatabaseError };
export { constraintsDictionary, databaseDictionary, isDatabaseError, databaseErrorHttpErrors };
