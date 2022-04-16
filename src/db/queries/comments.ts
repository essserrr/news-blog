import { Tables } from './tables';
import { UsersTable } from './users';
import { NewsTable } from './news';

enum CommentsTable {
  ID = 'id',
  NID = 'nid',
  UID = 'uid',
  MESSAGE = 'message',
}

enum CommentsRules {
  SORT_BY_NID = 'comments_nid_sort_asc',
  SORT_BY_ID = 'comments_id_sort_asc',
}

const CURRENT_TABLE = Tables.COMMENTS;

const comments = {
  createCommentsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
      ${CommentsTable.ID} bigserial NOT NULL PRIMARY KEY,
      ${CommentsTable.NID} bigserial NOT NULL REFERENCES ${Tables.NEWS} (${NewsTable.ID}) ON DELETE CASCADE,
      ${CommentsTable.UID} bigserial REFERENCES ${Tables.USERS} (${UsersTable.UID}) ON DELETE SET NULL,
      ${CommentsTable.MESSAGE} text
    );

    CREATE INDEX IF NOT EXISTS ${CommentsRules.SORT_BY_NID} ON ${CURRENT_TABLE} USING btree (${CommentsTable.NID} ASC);
    CREATE INDEX IF NOT EXISTS ${CommentsRules.SORT_BY_ID} ON ${CURRENT_TABLE} USING btree (${CommentsTable.ID} ASC);
`,

  insert: `INSERT INTO ${CURRENT_TABLE}
            (${CommentsTable.NID}, ${CommentsTable.UID}, ${CommentsTable.MESSAGE}) 
            VALUES ($1, $2, $3) RETURNING *;`,

  delete: `DELETE FROM ${CURRENT_TABLE}	WHERE ${CommentsTable.ID}=$1;`,

  selectAll: `
    SELECT
      (SELECT COUNT(*) FROM ${CURRENT_TABLE}) as count, 
      (SELECT json_agg(t.*) 
        FROM (
          SELECT * FROM ${CURRENT_TABLE}
          WHERE ${CommentsTable.NID}=$1
          ORDER BY ${CommentsTable.ID} ASC 
          LIMIT $2 
          OFFSET $3
        ) AS t
      ) AS rows;`,
} as const;

export { CommentsTable, CommentsRules, comments };
