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

const CURRENT_TABLE = Tables.CATEGORIES;

const categories = {
  createCategoriesTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${CategoriesTable.ID} serial NOT NULL PRIMARY KEY,
        ${CategoriesTable.PID} integer REFERENCES ${CURRENT_TABLE} (${CategoriesTable.ID}) ON DELETE CASCADE,
        ${CategoriesTable.NAME} text NOT NULL, 
        CONSTRAINT ${CategoryRules.PROPER_PID} CHECK (${CategoriesTable.PID} <> ${CategoriesTable.ID} AND ${CategoriesTable.PID} > 0)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ${CategoryRules.UNIQUE_NAME} ON ${CURRENT_TABLE} (lower(${CategoriesTable.NAME}));
    CREATE INDEX IF NOT EXISTS ${CategoryRules.SORT_BY_ID} ON ${CURRENT_TABLE} USING btree (${CategoriesTable.ID} ASC);
`,

  insert: `INSERT INTO ${CURRENT_TABLE}(${CategoriesTable.NAME}, ${CategoriesTable.PID}) VALUES ($1, $2) RETURNING *;`,

  update: `
  UPDATE ${CURRENT_TABLE}
    SET 
        ${CategoriesTable.NAME} = COALESCE($2, ${CategoriesTable.NAME}),
        ${CategoriesTable.PID} =  CASE 
                                    WHEN $3='(null_value)' THEN NULL
                                    ELSE COALESCE($3::integer, ${CategoriesTable.PID})
                                  END
    WHERE ${CategoriesTable.ID}=$1 RETURNING *;`,

  delete: `DELETE FROM ${CURRENT_TABLE}	WHERE ${CategoriesTable.ID}=$1;`,

  selectAll: `
    SELECT
      (SELECT COUNT(*) FROM ${CURRENT_TABLE}) as count, 
      (SELECT json_agg(t.*) 
        FROM (
          SELECT * FROM ${CURRENT_TABLE}
          ORDER BY ${CategoriesTable.ID} ASC 
          LIMIT $1 
          OFFSET $2
        ) AS t
      ) AS rows;`,

  select: `SELECT * FROM ${CURRENT_TABLE} WHERE ${CategoriesTable.ID}=$1;`,

  selectRecursively: `
  WITH RECURSIVE r AS (
    SELECT ${CategoriesTable.ID}, ${CategoriesTable.PID}, ${CategoriesTable.NAME}, 1 AS level
    FROM ${CURRENT_TABLE}
    WHERE ${CategoriesTable.ID} = $1
  
    UNION ALL
  
    SELECT ${CURRENT_TABLE}.${CategoriesTable.ID}, ${CURRENT_TABLE}.${CategoriesTable.PID}, ${CURRENT_TABLE}.${CategoriesTable.NAME}, r.level + 1 AS level
    FROM ${CURRENT_TABLE}
      JOIN r ON ${CURRENT_TABLE}.${CategoriesTable.ID} = r.${CategoriesTable.PID}
  )
  SELECT * FROM r;
  `,
} as const;

export { CategoriesTable, CategoryRules, categories };
