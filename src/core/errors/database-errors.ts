import { TagRules } from 'src/db/queries/tags';
import { CategoryRules } from 'src/db/queries/categories';
import { UserRules } from 'src/db/queries/users';

type DatabaseErrorCodes = 'NAME_CONFLICT' | 'WRONG_REFERENCE';
type KnownConstraints =
  | 'categories_pid_fkey'
  | CategoryRules.PROPER_PID
  | CategoryRules.UNIQUE_NAME
  | TagRules.UNIQUE_NAME
  | UserRules.UNIQUE_USERNAME;

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
  '23503': 'WRONG_REFERENCE',
  '23514': 'WRONG_REFERENCE',
};

const constraintsDictionary: Record<string, KnownConstraints> = {
  categories_pid_fkey: 'categories_pid_fkey',
  [CategoryRules.PROPER_PID]: CategoryRules.PROPER_PID,
  [CategoryRules.UNIQUE_NAME]: CategoryRules.UNIQUE_NAME,
  [TagRules.UNIQUE_NAME]: TagRules.UNIQUE_NAME,
  [UserRules.UNIQUE_USERNAME]: UserRules.UNIQUE_USERNAME,
};

const isDatabaseError = (e: any): e is IDatabaseError => {
  if (!e || typeof e !== 'object') return false;
  if (typeof e.schema !== 'string' || typeof e.table !== 'string') return false;
  return true;
};

const databaseErrorHttpErrors: Record<DatabaseErrorCodes, number> = {
  NAME_CONFLICT: 409,
  WRONG_REFERENCE: 400,
};

export type { DatabaseErrorCodes, IDatabaseError };
export { constraintsDictionary, databaseDictionary, isDatabaseError, databaseErrorHttpErrors };
