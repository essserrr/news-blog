import { Tables } from './tables';

enum TagsTable {
  ID = 'id',
  NAME = 'name',
}

enum TagRules {
  UNIQUE_NAME = 'tags_name_unique',
  SORT_BY_ID = 'tags_id_sort_asc',
}

const tags = {
  createTagsTable: `CREATE TABLE IF NOT EXISTS ${Tables.TAGS}(
        ${TagsTable.ID} serial NOT NULL PRIMARY KEY,
        ${TagsTable.NAME} text NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ${TagRules.UNIQUE_NAME}  ON ${Tables.TAGS} (lower(${TagsTable.NAME}));
    CREATE INDEX IF NOT EXISTS ${TagRules.SORT_BY_ID} ON ${Tables.TAGS} USING btree (${TagsTable.ID} ASC);
`,

  insert: `INSERT INTO ${Tables.TAGS}(${TagsTable.NAME}) VALUES ($1) RETURNING *;`,

  update: `UPDATE ${Tables.TAGS} SET ${TagsTable.NAME}=$2 WHERE ${TagsTable.ID}=$1 RETURNING *;`,

  delete: `DELETE FROM ${Tables.TAGS}	WHERE ${TagsTable.ID}=$1;`,

  selectAll: `
    SELECT
      (SELECT COUNT(*) FROM ${Tables.TAGS}) as count, 
      (SELECT json_agg(t.*) 
        FROM (
          SELECT * FROM ${Tables.TAGS}
          ORDER BY ${TagsTable.ID} ASC 
          LIMIT $1 
          OFFSET $2
        ) AS t
      ) AS rows;`,

  select: `SELECT * FROM ${Tables.TAGS} WHERE ${TagsTable.ID}=$1;`,
} as const;

export { TagsTable, TagRules, tags };
