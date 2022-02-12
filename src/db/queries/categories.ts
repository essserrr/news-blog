import { Tables } from './tables';

enum CategoriesTable {
  ID = 'id',
  PID = 'pid',
  NAME = 'name',
}

enum CategoryRules {
  UNIQUE_NAME = 'categories_name_unique',
  PROPER_PID = 'categories_pid_proper',
  SORT_BY_ID = 'categories_id_sort_asc',
}

const categories = {
  createCategoriesTable: `CREATE TABLE IF NOT EXISTS ${Tables.CATEGORIES}(
        ${CategoriesTable.ID} serial NOT NULL PRIMARY KEY,
        ${CategoriesTable.PID} integer REFERENCES ${Tables.CATEGORIES} (${CategoriesTable.ID}) ON DELETE CASCADE,
        ${CategoriesTable.NAME} text NOT NULL, 
        CONSTRAINT ${CategoryRules.PROPER_PID} CHECK (${CategoriesTable.PID} <> ${CategoriesTable.ID} AND ${CategoriesTable.PID} > 0)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ${CategoryRules.UNIQUE_NAME} ON ${Tables.CATEGORIES} (lower(${CategoriesTable.NAME}));
    CREATE INDEX IF NOT EXISTS ${CategoryRules.SORT_BY_ID} ON ${Tables.CATEGORIES} USING btree (${CategoriesTable.ID} ASC);
`,

  insert: `INSERT INTO ${Tables.CATEGORIES}(${CategoriesTable.NAME}, ${CategoriesTable.PID}) VALUES ($1, $2) RETURNING *;`,

  update: `UPDATE ${Tables.CATEGORIES} SET ${CategoriesTable.NAME}=$2 WHERE ${CategoriesTable.ID}=$1 RETURNING *;`,

  delete: `DELETE FROM ${Tables.CATEGORIES}	WHERE ${CategoriesTable.ID}=$1;`,

  selectAll: `
    SELECT
      (SELECT COUNT(*) FROM ${Tables.CATEGORIES}) as count, 
      (SELECT json_agg(t.*) 
        FROM (
          SELECT * FROM ${Tables.CATEGORIES}
          ORDER BY ${CategoriesTable.ID} ASC 
          LIMIT $1 
          OFFSET $2
        ) AS t
      ) AS rows;`,

  select: `SELECT * FROM ${Tables.CATEGORIES} WHERE ${CategoriesTable.ID}=$1;`,
} as const;

export { CategoriesTable, CategoryRules, categories };
