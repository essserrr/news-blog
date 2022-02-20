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

const users = {
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

  insert: (tags: Array<number>) => `
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
        INSERT INTO ${Tables.NEWS_TAGS} (${NewsTagsTable.NID}, ${NewsTagsTable.ID}) VALUES 
        ${tags.map((t) => `(news_body.id, ${t})`).join(', ')} RETURNING ${NewsTagsTable.ID};
      )


      SELECT news_body.* as news, news_tags.* as "tags"
      FROM   news_body JOIN news_tags
`,

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

export { NewsTable, NewsRules, users };
