import { Tables } from './tables';

enum TagsTable {
  ID = 'id',
  NAME = 'name',
}

const tags = {
  createTagsTable: `CREATE TABLE IF NOT EXISTS ${Tables.TAGS}(
        ${TagsTable.ID} serial NOT NULL,
        ${TagsTable.NAME} text NOT NULL,
        PRIMARY KEY (${TagsTable.ID})
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ${TagsTable.NAME}_lower_unique  ON ${Tables.TAGS} (lower(${TagsTable.NAME}));
    CREATE INDEX IF NOT EXISTS ${TagsTable.ID}_asc_index ON ${Tables.TAGS} USING btree (${TagsTable.ID} ASC);
`,

  insert: `INSERT INTO ${Tables.TAGS}(${TagsTable.NAME}) VALUES ($1) RETURNING *;`,

  update: `UPDATE ${Tables.TAGS} SET ${TagsTable.NAME}=$1 WHERE ${TagsTable.ID}=$2 RETURNING *;`,

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

export { TagsTable, tags };
