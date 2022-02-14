import { Tables } from './tables';

enum UsersTable {
  UID = 'uid',
  NAME = 'name',
  SECOND_NAME = 'second_name',
  AVATAR = 'avatar',
  USERNAME = 'username',
  PASSWORD = 'password',
  CREATED_AT = 'created_at',
  IS_ADMIN = 'is_admin',
  AUTH_TOKEN = 'auth_token',
}

enum UserRules {
  UNIQUE_USERNAME = 'users_username_unique',
  SORT_BY_USERNAME = 'users_username_sort_asc',
}

const users = {
  createUsersTable: `CREATE TABLE IF NOT EXISTS ${Tables.USERS}(
        ${UsersTable.UID} bigserial NOT NULL PRIMARY KEY,
        ${UsersTable.NAME} text NOT NULL,
        ${UsersTable.SECOND_NAME} text NOT NULL,
        ${UsersTable.AVATAR} text,
        ${UsersTable.USERNAME} text NOT NULL,
        ${UsersTable.PASSWORD} text NOT NULL,
        ${UsersTable.CREATED_AT} TIMESTAMP NOT NULL DEFAULT NOW(),
        ${UsersTable.IS_ADMIN} boolean NOT NULL DEFAULT FALSE,
        ${UsersTable.AUTH_TOKEN} text
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ${UserRules.UNIQUE_USERNAME} ON ${Tables.USERS} (${UsersTable.USERNAME});
    CREATE INDEX IF NOT EXISTS ${UserRules.SORT_BY_USERNAME} ON ${Tables.USERS} USING btree (${UsersTable.USERNAME} ASC);
`,

  signup: `INSERT INTO ${Tables.USERS}(
                ${UsersTable.NAME}, 
                ${UsersTable.SECOND_NAME}, 
                ${UsersTable.AVATAR}, 
                ${UsersTable.USERNAME}, 
                ${UsersTable.PASSWORD},
                ${UsersTable.AUTH_TOKEN}
          ) VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *;`,
  delete: `DELETE FROM ${Tables.USERS} WHERE ${UsersTable.UID}=$1;`,

  select: `SELECT * FROM ${Tables.USERS} WHERE ${UsersTable.UID}=$1;`,

  login: `UPDATE ${Tables.USERS} SET ${UsersTable.AUTH_TOKEN} = COALESCE($2, ${UsersTable.USERNAME}) WHERE ${UsersTable.UID}=$1 RETURNING *;`,
  logout: `UPDATE ${Tables.USERS} SET ${UsersTable.AUTH_TOKEN} = NULL WHERE ${UsersTable.UID}=$1;`,

  // !!!! not null
  auth: `SELECT * FROM ${Tables.USERS} WHERE (${UsersTable.UID}=$1 AND ${UsersTable.AUTH_TOKEN}=$2);`,

  update: `
              UPDATE ${Tables.USERS}
                SET 
                    ${UsersTable.NAME} = COALESCE($2, ${UsersTable.NAME}),
                    ${UsersTable.SECOND_NAME} = COALESCE($3, ${UsersTable.SECOND_NAME}),
                    ${UsersTable.AVATAR} = CASE 
                                            WHEN $3='(null_value)' THEN NULL
                                            ELSE COALESCE($4, ${UsersTable.AVATAR})
                                          END,
                    ${UsersTable.USERNAME} = COALESCE($5, ${UsersTable.USERNAME}),
                    ${UsersTable.PASSWORD} = COALESCE($6, ${UsersTable.PASSWORD}),
                WHERE ${UsersTable.UID}=$1 
                RETURNING *;`,

  selectAll: `
                    SELECT
                      (SELECT COUNT(*) FROM ${Tables.USERS}) as count, 
                      (SELECT json_agg(t.*) 
                        FROM (
                          SELECT 
                                  ${UsersTable.UID},
                                  ${UsersTable.NAME},
                                  ${UsersTable.SECOND_NAME},
                                  ${UsersTable.AVATAR},
                                  ${UsersTable.USERNAME},
                                  ${UsersTable.IS_ADMIN}
                          FROM ${Tables.USERS}
                          ORDER BY ${UsersTable.USERNAME} ASC 
                          LIMIT $1 
                          OFFSET $2
                        ) AS t
                      ) AS rows;`,
} as const;

export { UsersTable, UserRules, users };
