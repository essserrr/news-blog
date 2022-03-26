import { Tables } from './tables';
import { UsersTable } from './users';

enum AuthorsTable {
  UID = 'uid',
  DESCRIPTION = 'description',
}

enum AuthorRules {
  SORT_BY_UID = 'users_uid_sort_asc',
}

const CURRENT_TABLE = Tables.AUTHORS;

const authors = {
  createAuthorsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${AuthorsTable.UID} bigserial NOT NULL PRIMARY KEY REFERENCES ${Tables.USERS} (${UsersTable.UID}) ON DELETE CASCADE,
        ${AuthorsTable.DESCRIPTION} text
    );

    CREATE INDEX IF NOT EXISTS ${AuthorRules.SORT_BY_UID} ON ${CURRENT_TABLE} USING btree (${AuthorsTable.UID} ASC);
`,

  insert: `INSERT INTO ${CURRENT_TABLE}(${AuthorsTable.UID}, ${AuthorsTable.DESCRIPTION}) VALUES ($1, $2) RETURNING *;`,

  delete: `DELETE FROM ${CURRENT_TABLE} WHERE ${AuthorsTable.UID}=$1;`,

  select: `SELECT * FROM ${CURRENT_TABLE} WHERE ${AuthorsTable.UID}=$1;`,

  update: `
              UPDATE ${CURRENT_TABLE}
                SET ${AuthorsTable.DESCRIPTION} = CASE 
                                            WHEN $2='(null_value)' THEN NULL
                                            ELSE COALESCE($2, ${AuthorsTable.DESCRIPTION})
                                          END
                WHERE ${AuthorsTable.UID}=$1 
                RETURNING *;`,

  selectAll: `
              SELECT
                (SELECT COUNT(*) FROM ${CURRENT_TABLE}) as count, 
                (SELECT json_agg(t.*) 
                  FROM (
                    SELECT * FROM ${CURRENT_TABLE}
                    ORDER BY ${AuthorsTable.UID} ASC 
                    LIMIT $1 
                    OFFSET $2
                  ) AS t
                ) AS rows;`,
} as const;

export { AuthorsTable, AuthorRules, authors };
