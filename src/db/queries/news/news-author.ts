import { Tables } from '../tables';
import { timestampToInteger } from '../converters';
import { AuthorsTable } from '../authors';
import { UsersTable } from '../users';

const author = `
  ${Tables.USERS}.${AuthorsTable.UID}, 
  ${Tables.AUTHORS}.${AuthorsTable.DESCRIPTION},
  ${Tables.USERS}.${UsersTable.USERNAME},
  ${Tables.USERS}.${UsersTable.SECOND_NAME},
  ${Tables.USERS}.${UsersTable.NAME},
  ${Tables.USERS}.${UsersTable.AVATAR},
  ${Tables.USERS}.${UsersTable.IS_ADMIN},
  ${timestampToInteger(`${Tables.USERS}.${UsersTable.CREATED_AT}`, UsersTable.CREATED_AT)}
` as const;

export { author };
