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
    CREATE UNIQUE INDEX IF NOT EXISTS ${TagsTable.NAME}_lower_unique 
        ON ${Tables.TAGS} (lower(${TagsTable.NAME}));`,

  insert: `INSERT INTO ${Tables.TAGS}(${TagsTable.NAME}) VALUES ($1);`,

  update: `UPDATE ${Tables.TAGS} SET ${TagsTable.NAME}=$1 WHERE ${TagsTable.ID}=$2;`,

  delete: `DELETE FROM ${Tables.TAGS}	WHERE ${TagsTable.ID}=$1;`,

  selectAll: `SELECT * FROM ${Tables.TAGS};`,

  select: `SELECT * FROM ${Tables.TAGS}WHERE ${TagsTable.ID}=$1`,
} as const;

export { TagsTable, tags };
