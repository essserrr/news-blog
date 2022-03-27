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

const authorObject = `
  '${AuthorsTable.UID}', ${Tables.USERS}.${AuthorsTable.UID}, 
  '${AuthorsTable.DESCRIPTION}', ${Tables.AUTHORS}.${AuthorsTable.DESCRIPTION},
  '${UsersTable.USERNAME}', ${Tables.USERS}.${UsersTable.USERNAME},
  '${UsersTable.SECOND_NAME}', ${Tables.USERS}.${UsersTable.SECOND_NAME},
  '${UsersTable.NAME}', ${Tables.USERS}.${UsersTable.NAME},
  '${UsersTable.AVATAR}', ${Tables.USERS}.${UsersTable.AVATAR},
  '${UsersTable.IS_ADMIN}', ${Tables.USERS}.${UsersTable.IS_ADMIN},
  '${UsersTable.CREATED_AT}', ${timestampToInteger(
  `${Tables.USERS}.${UsersTable.CREATED_AT}`,
  undefined,
  'none',
)}
` as const;

export { author, authorObject };
