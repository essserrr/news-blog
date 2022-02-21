import { Tables } from '../tables';
import { AuthorsTable } from '../authors';
import { CategoriesTable } from '../categories';
import { timestampToInteger } from '../converters';

import { newsTags, NewsTagsTable } from './news-tags';
import { newsBody, NewsBodyTable } from './news-body';

enum NewsParts {
  BODY = 'news_body',
  TAGS = 'news_tags_list',
}

const bodyEntities = {
  ALL: `${NewsParts.BODY}.*`,
  ID: `${NewsParts.BODY}.${NewsBodyTable.ID}`,
  AUTHOR: `${NewsParts.BODY}.${NewsBodyTable.AUTHOR}`,
  TITLE: `${NewsParts.BODY}.${NewsBodyTable.TITLE}`,
  CONTENT: `${NewsParts.BODY}.${NewsBodyTable.CONTENT}`,
  CATEGORY: `${NewsParts.BODY}.${NewsBodyTable.CATEGORY}`,
  MAIN_IMAGE: `${NewsParts.BODY}.${NewsBodyTable.MAIN_IMAGE}`,
  CREATED_AT: `${NewsParts.BODY}.${NewsBodyTable.CREATED_AT}`,
} as const;

const tagsEntities = {
  ALL: `${NewsParts.TAGS}.*`,
  ID: `${NewsParts.TAGS}.${NewsTagsTable.ID}`,
  NID: `${NewsParts.TAGS}.${NewsTagsTable.NID}`,
} as const;

const newsRules = {
  group: `
    ${bodyEntities.ID}, 
    ${bodyEntities.AUTHOR}, 
    ${bodyEntities.TITLE}, 
    ${bodyEntities.CONTENT}, 
    ${bodyEntities.CATEGORY}, 
    ${bodyEntities.MAIN_IMAGE}, 
    ${bodyEntities.CREATED_AT}
`,
} as const;

const news = {
  createNewsTable: `
    ${newsBody.createNewsTable}
    ${newsTags.createNewsTagsTable}
  `,

  insert: `
    WITH 
      ${NewsParts.BODY} AS ( 
          INSERT INTO ${Tables.NEWS} (
            ${NewsBodyTable.AUTHOR}, 
            ${NewsBodyTable.TITLE}, 
            ${NewsBodyTable.CONTENT}, 
            ${NewsBodyTable.CATEGORY}, 
            ${NewsBodyTable.MAIN_IMAGE}
          ) VALUES ($1, $2, $3, $4, $5) RETURNING *
        ),

      ${NewsParts.TAGS} AS (
        INSERT INTO ${Tables.NEWS_TAGS} (${NewsTagsTable.NID}, ${NewsTagsTable.ID}) 
        SELECT ${bodyEntities.ID}, unnest($6::integer[]) FROM ${NewsParts.BODY} 
        RETURNING ${NewsTagsTable.ID}
      )
      
    SELECT ${bodyEntities.ALL}, ${timestampToInteger(
    `${bodyEntities.CREATED_AT}`,
    NewsBodyTable.CREATED_AT,
  )}, json_agg(json_build_object(
      '${NewsTagsTable.ID}',  ${tagsEntities.ID}
    )) AS tags
        FROM ${NewsParts.BODY}, ${NewsParts.TAGS}
        GROUP BY ${newsRules.group}
` as const,

  delete: `DELETE FROM ${Tables.NEWS} WHERE ${NewsBodyTable.ID}=$1;`,

  select: `SELECT *, ${timestampToInteger(NewsBodyTable.CREATED_AT)} FROM ${Tables.NEWS} WHERE ${
    NewsBodyTable.ID
  }=$1;`,

  update: `
              UPDATE ${Tables.NEWS}
                SET 
                    ${NewsBodyTable.AUTHOR} = COALESCE($2, ${NewsBodyTable.AUTHOR}),
                    ${NewsBodyTable.TITLE} = COALESCE($3, ${NewsBodyTable.TITLE}),
                    ${NewsBodyTable.CONTENT} = COALESCE($4, ${NewsBodyTable.CONTENT}),
                    ${NewsBodyTable.CATEGORY} = COALESCE($5, ${NewsBodyTable.CATEGORY}),
                    ${NewsBodyTable.MAIN_IMAGE} = COALESCE($6, ${NewsBodyTable.MAIN_IMAGE})
                WHERE ${NewsBodyTable.ID}=$1 
                RETURNING *;`,

  selectAll: `
                    SELECT
                      (SELECT COUNT(*) FROM ${Tables.NEWS}) as count, 
                      (SELECT json_agg(t.*) 
                        FROM (
                          SELECT * FROM ${Tables.NEWS} ORDER BY ${NewsBodyTable.ID} ASC LIMIT $1 OFFSET $2
                        ) AS t
                      ) AS rows;`,
} as const;

export { NewsBodyTable, NewsRules, news };
