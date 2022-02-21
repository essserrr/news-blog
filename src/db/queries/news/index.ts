import { Tables } from '../tables';
import { timestampToInteger } from '../converters';
import { AuthorsTable } from '../authors';
import { TagsTable } from '../tags';
import { UsersTable } from '../users';

import { newsTags, TagsSubTable } from './news-tags';
import { newsBody, NewsTable } from './news-body';
import { author } from './news-author';

enum Parts {
  BODY = 'news_body',
  AUTHOR = 'news_author',
  TAGS = 'news_tags_list',
  TAGS_FULL = 'news_tags_list_full',
}

const bodyPart = {
  ALL: `${Parts.BODY}.*`,
  ID: `${Parts.BODY}.${NewsTable.ID}`,
  AUTHOR: `${Parts.BODY}.${NewsTable.AUTHOR}`,
  TITLE: `${Parts.BODY}.${NewsTable.TITLE}`,
  CONTENT: `${Parts.BODY}.${NewsTable.CONTENT}`,
  CATEGORY: `${Parts.BODY}.${NewsTable.CATEGORY}`,
  MAIN_IMAGE: `${Parts.BODY}.${NewsTable.MAIN_IMAGE}`,
  CREATED_AT: `${Parts.BODY}.${NewsTable.CREATED_AT}`,
} as const;

const tagsPart = {
  ALL: `${Parts.TAGS}.*`,
  ID: `${Parts.TAGS}.${TagsSubTable.ID}`,
  NID: `${Parts.TAGS}.${TagsSubTable.NID}`,
} as const;

const authorPart = {
  ALL: `${Parts.AUTHOR}.*`,
} as const;

const tagsFullPart = {
  ALL: `${Parts.TAGS_FULL}.*`,
} as const;

const newsRules = {
  group: `
    ${bodyPart.ID}, 
    ${bodyPart.AUTHOR}, 
    ${bodyPart.TITLE}, 
    ${bodyPart.CONTENT}, 
    ${bodyPart.CATEGORY}, 
    ${bodyPart.MAIN_IMAGE}, 
    ${bodyPart.CREATED_AT}
`,
} as const;

const news = {
  createNewsTable: `
    ${newsBody.createNewsTable}
    ${newsTags.createTagsSubTable}
  `,

  insert: `
    WITH 
      ${Parts.BODY} AS ( 
          INSERT INTO ${Tables.NEWS} (
            ${NewsTable.AUTHOR}, 
            ${NewsTable.TITLE}, 
            ${NewsTable.CONTENT}, 
            ${NewsTable.CATEGORY}, 
            ${NewsTable.MAIN_IMAGE}
          ) VALUES ($1, $2, $3, $4, $5) RETURNING *
        ),

      ${Parts.TAGS} AS (
        INSERT INTO ${Tables.NEWS_TAGS} (${TagsSubTable.NID}, ${TagsSubTable.ID}) 
        SELECT ${bodyPart.ID}, unnest($6::integer[]) FROM ${Parts.BODY} 
        RETURNING ${TagsSubTable.ID}
      )
      
    SELECT 
        ${bodyPart.ALL}, ${timestampToInteger(`${bodyPart.CREATED_AT}`, NewsTable.CREATED_AT)}, 
        json_agg(json_build_object('${TagsSubTable.ID}',  ${tagsPart.ID})) AS tags
        FROM ${Parts.BODY}, ${Parts.TAGS}
    GROUP BY ${newsRules.group};
` as const,

  select: `
        WITH 
          ${Parts.BODY} AS ( 
            SELECT * FROM ${Tables.NEWS} WHERE ${NewsTable.ID}=$1
          ),

          ${Parts.TAGS} AS (
            SELECT ${TagsSubTable.ID} FROM ${Tables.NEWS_TAGS} WHERE ${TagsSubTable.NID}=$1
          ),

          ${Parts.TAGS_FULL} AS (
            SELECT * FROM ${Parts.TAGS} 
            LEFT JOIN ${Tables.TAGS}
              ON ${tagsPart.ID} = ${Tables.TAGS}.${TagsTable.ID}
          ),

          ${Parts.AUTHOR} AS (
            SELECT ${author} FROM ${Parts.BODY} 

            LEFT JOIN ${Tables.AUTHORS}
              ON ${bodyPart.AUTHOR} = ${Tables.AUTHORS}.${AuthorsTable.UID}
            LEFT JOIN ${Tables.USERS}
              ON ${bodyPart.AUTHOR} = ${Tables.USERS}.${UsersTable.UID}
          )
        
        SELECT 
          ${bodyPart.ALL}, ${timestampToInteger(`${bodyPart.CREATED_AT}`, NewsTable.CREATED_AT)}, 
          json_agg(${tagsFullPart.ALL}) AS tags,
          to_json(${authorPart.ALL}) AS author

        FROM ${Parts.BODY}, ${Parts.TAGS_FULL}, ${Parts.AUTHOR}

        GROUP BY ${newsRules.group}, ${authorPart.ALL};`,

  delete: `DELETE FROM ${Tables.NEWS} WHERE ${NewsTable.ID}=$1;`,

  update: `
              UPDATE ${Tables.NEWS}
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
                      (SELECT COUNT(*) FROM ${Tables.NEWS}) as count, 
                      (SELECT json_agg(t.*) 
                        FROM (
                          SELECT * FROM ${Tables.NEWS} ORDER BY ${NewsTable.ID} ASC LIMIT $1 OFFSET $2
                        ) AS t
                      ) AS rows;`,
} as const;

export { NewsTable, newsRules, news };
