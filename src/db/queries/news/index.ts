import { Tables } from '../tables';
import { AuthorsTable } from '../authors';
import { CategoriesTable } from '../categories';
import { timestampToInteger } from '../converters';

import { newsTags, NewsTagsTable } from './news-tags';

enum NewsTable {
  ID = 'id',
  AUTHOR = 'author',
  TITLE = 'title',
  CONTENT = 'content',
  CATEGORY = 'category',
  MAIN_IMAGE = 'main_image',
  CREATED_AT = 'created_at',
}

enum NewsRules {}

const CURRENT_TABLE = Tables.NEWS;

const news = {
  createNewsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${NewsTable.ID} bigserial NOT NULL PRIMARY KEY,
        ${NewsTable.AUTHOR} bigserial REFERENCES ${Tables.AUTHORS} (${AuthorsTable.UID}) ON DELETE SET NULL,
        ${NewsTable.TITLE} text NOT NULL,
        ${NewsTable.CONTENT} text NOT NULL,
        ${NewsTable.CATEGORY} serial REFERENCES ${Tables.CATEGORIES} (${CategoriesTable.ID}) ON DELETE SET NULL,
        ${NewsTable.MAIN_IMAGE} text NOT NULL,
        ${NewsTable.CREATED_AT} TIMESTAMP NOT NULL DEFAULT NOW()
    );
    ${newsTags.createNewsTagsTable}
`,

  insert: `
  WITH 
      news_body AS ( 
          INSERT INTO ${CURRENT_TABLE} (
            ${NewsTable.AUTHOR}, 
            ${NewsTable.TITLE}, 
            ${NewsTable.CONTENT}, 
            ${NewsTable.CATEGORY}, 
            ${NewsTable.MAIN_IMAGE}
          ) VALUES ($1, $2, $3, $4, $5) RETURNING *
        ),

      news_tags AS (
        INSERT INTO ${Tables.NEWS_TAGS} (${NewsTagsTable.NID}, ${NewsTagsTable.ID}) 
        SELECT news_body.id, unnest($6::integer[]) FROM news_body 
        RETURNING ${NewsTagsTable.ID}
      )


  SELECT news_body.*, ${timestampToInteger(
    `news_body.${NewsTable.CREATED_AT}`,
    NewsTable.CREATED_AT,
  )}, json_agg(json_build_object(
    '${NewsTagsTable.ID}', news_tags.${NewsTagsTable.ID}
  )) AS tags
      FROM news_body, news_tags
      GROUP BY news_body.id, news_body.author, news_body.title, news_body.content, news_body.category, news_body.main_image, news_body.created_at
` as const,

  /*
SELECT json_agg(each_table_rows.data) FROM (
        SELECT json_build_object('body',tbl1.*) AS data
        FROM (
          SELECT t1.* FROM news_body t1
        ) tbl1
        UNION ALL
        SELECT json_build_object('tags',tbl2.*)
        FROM (
          SELECT t2.* FROM news_tags t2
        ) tbl2
      ) each_table_rows;

*/

  delete: `DELETE FROM ${CURRENT_TABLE} WHERE ${NewsTable.ID}=$1;`,

  select: `SELECT *, ${timestampToInteger(NewsTable.CREATED_AT)} FROM ${CURRENT_TABLE} WHERE ${
    NewsTable.ID
  }=$1;`,

  update: `
              UPDATE ${CURRENT_TABLE}
                SET 
                    ${NewsTable.AUTHOR} = COALESCE($2, ${NewsTable.AUTHOR}),
                    ${NewsTable.TITLE} = COALESCE($3, ${NewsTable.TITLE}),
                    ${NewsTable.CONTENT} = COALESCE($4, ${NewsTable.CONTENT}),
                    ${NewsTable.CATEGORY} = COALESCE($5, ${NewsTable.CATEGORY}),
                    ${NewsTable.MAIN_IMAGE} = COALESCE($6, ${NewsTable.MAIN_IMAGE})
                WHERE ${NewsTable.ID}=$1 
                RETURNING *;`,

  selectAll: `
                    SELECT
                      (SELECT COUNT(*) FROM ${CURRENT_TABLE}) as count, 
                      (SELECT json_agg(t.*) 
                        FROM (
                          SELECT * FROM ${CURRENT_TABLE} ORDER BY ${NewsTable.ID} ASC LIMIT $1 OFFSET $2
                        ) AS t
                      ) AS rows;`,
} as const;

export { NewsTable, NewsRules, news };
