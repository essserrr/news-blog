import { Tables } from './tables';

enum TagsTable {
  ID = 'id',
  NAME = 'name',
}

enum TagRules {
  UNIQUE_NAME = 'tags_name_unique',
  SORT_BY_ID = 'tags_id_sort_asc',
}

const CURRENT_TABLE = Tables.TAGS;

const tags = {
  createTagsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${TagsTable.ID} serial NOT NULL PRIMARY KEY,
        ${TagsTable.NAME} text NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ${TagRules.UNIQUE_NAME}  ON ${CURRENT_TABLE} (lower(${TagsTable.NAME}));
    CREATE INDEX IF NOT EXISTS ${TagRules.SORT_BY_ID} ON ${CURRENT_TABLE} USING btree (${TagsTable.ID} ASC);
`,

  insert: `INSERT INTO ${CURRENT_TABLE}(${TagsTable.NAME}) VALUES ($1) RETURNING *;`,

  update: `UPDATE ${CURRENT_TABLE} SET ${TagsTable.NAME} = COALESCE($2, ${TagsTable.NAME}) WHERE ${TagsTable.ID}=$1 RETURNING *;`,

  delete: `DELETE FROM ${CURRENT_TABLE}	WHERE ${TagsTable.ID}=$1;`,

  selectAll: `
    SELECT
      (SELECT COUNT(*) FROM ${CURRENT_TABLE}) as count, 
      (SELECT json_agg(t.*) 
        FROM (
          SELECT * FROM ${CURRENT_TABLE}
          ORDER BY ${TagsTable.ID} ASC 
          LIMIT $1 
          OFFSET $2
        ) AS t
      ) AS rows;`,

  select: `SELECT * FROM ${CURRENT_TABLE} WHERE ${TagsTable.ID}=$1;`,
} as const;

export { TagsTable, TagRules, tags };
