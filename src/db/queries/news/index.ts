import { Tables } from '../tables';
import { timestampToInteger } from '../converters';
import { AuthorsTable } from '../authors';
import { TagsTable } from '../tags';
import { UsersTable } from '../users';
import { CategoriesTable } from '../categories';

import { newsTags, TagsSubTable, tagsObject } from './news-tags';
import { newsBody, NewsTable } from './news-body';
import { newsImages, ImagesSubTable } from './news-images';
import { author, authorObject } from './news-author';

enum NewsFields {
  TAGS = 'tags',
  AUX_IMAGES = 'aux_images',
}

enum Parts {
  BODY = 'news_body',
  AUTHOR = 'news_author',
  TAGS = 'news_tags_list',
  TAGS_FULL = 'news_tags_list_full',
  IMAGES = 'news_aux_images_list',
  CATEGORIES = 'news_categories_list',
}

const bodyPart = {
  ALL: `${Parts.BODY}.*`,
  ID: `${Parts.BODY}.${NewsTable.ID}`,
  AUTHOR: `${Parts.BODY}.${NewsTable.AUTHOR}`,
  CATEGORY: `${Parts.BODY}.${NewsTable.CATEGORY}`,
  CREATED_AT: `${Parts.BODY}.${NewsTable.CREATED_AT}`,
} as const;

const tagsPart = {
  ALL: `${Parts.TAGS}.*`,
  ID: `${Parts.TAGS}.${TagsSubTable.ID}`,
} as const;

const authorPart = {
  ALL: `${Parts.AUTHOR}.*`,
} as const;

const tagsFullPart = {
  ALL: `${Parts.TAGS_FULL}.*`,
} as const;

const imagesPart = {
  ALL: `${Parts.IMAGES}.*`,
} as const;

enum Recursive {
  LEVEL = 'level',
}

const categoriesPart = {
  ALL: `${Parts.CATEGORIES}.*`,
  LEVEL: `${Parts.CATEGORIES}.${Recursive.LEVEL}`,
} as const;

const equal = (what: string, to: number | string) => `${what} = '${to}'`;

interface TagFilter {
  type: 'tag';
  filter: 'in' | 'all';
  tags: Array<number>;
}

enum SelectAllParts {
  FILTERED = 'all_filtered',
  RESULT = 'all_result',
}

const selectAllByTag = ({ filter, tags }: TagFilter) => {
  const LOCAL_TABLE = 'a';

  const minCount = filter === 'all' ? tags.length : 1;

  const whereCondition = tags.map((v) => equal(TagsSubTable.ID, v));

  return `
  SELECT ${LOCAL_TABLE}.${TagsSubTable.NID} as ${NewsTable.ID} FROM
    (SELECT 
      ${TagsSubTable.NID}, count(${TagsSubTable.ID})
    FROM ${Tables.NEWS_TAGS}
    WHERE ${whereCondition.join(' OR ')}
    GROUP BY ${TagsSubTable.NID}) ${LOCAL_TABLE}
  WHERE ${LOCAL_TABLE}.count >= '${minCount}'`;
};

type Filters = TagFilter;

const filters = (f: Filters) => {
  switch (f.type) {
    case 'tag':
      return selectAllByTag(f);
    default:
      return '';
  }
};

function selectAll(f: Filters) {
  const filterQuery = filters(f);

  return `

  WITH RECURSIVE
    ${SelectAllParts.FILTERED} AS (${filterQuery}),

    ${Parts.BODY} AS (
      SELECT ${Tables.NEWS}.* FROM ${SelectAllParts.FILTERED}

      LEFT JOIN ${Tables.NEWS}
        ON ${SelectAllParts.FILTERED}.${NewsTable.ID} = ${Tables.NEWS}.${NewsTable.ID}
    ),

    ${Parts.IMAGES} AS (
      SELECT 
        ${SelectAllParts.FILTERED}.${NewsTable.ID},
        NULLIF(array_agg(${ImagesSubTable.PATH}), '{NULL}') as ${NewsFields.AUX_IMAGES}  
      FROM ${SelectAllParts.FILTERED}

      LEFT JOIN ${Tables.NEWS_IMAGES}
        ON ${SelectAllParts.FILTERED}.${NewsTable.ID} = ${Tables.NEWS_IMAGES}.${ImagesSubTable.NID}
      
      GROUP BY ${SelectAllParts.FILTERED}.${NewsTable.ID}
    ),

    ${Parts.AUTHOR} AS (
      SELECT
        ${Parts.BODY}.${NewsTable.ID},
        jsonb_build_object(${authorObject}) AS ${NewsTable.AUTHOR}
      FROM ${Parts.BODY} 

      LEFT JOIN ${Tables.AUTHORS}
        ON ${Parts.BODY}.${NewsTable.AUTHOR} = ${Tables.AUTHORS}.${AuthorsTable.UID}
      LEFT JOIN ${Tables.USERS}
        ON ${Parts.BODY}.${NewsTable.AUTHOR} = ${Tables.USERS}.${UsersTable.UID} 
    ),

    
    ${Parts.TAGS} AS (
      SELECT
        ${Tables.NEWS_TAGS}.${TagsSubTable.NID} AS ${NewsTable.ID},
        NULLIF(array_agg(jsonb_build_object(${tagsObject})), '{NULL}') AS ${NewsFields.TAGS}
      FROM ${SelectAllParts.FILTERED}

      LEFT JOIN ${Tables.NEWS_TAGS}
        ON ${SelectAllParts.FILTERED}.${NewsTable.ID} = ${Tables.NEWS_TAGS}.${TagsSubTable.NID}
      LEFT JOIN ${Tables.TAGS}
        ON ${Tables.TAGS}.${TagsTable.ID} = ${Tables.NEWS_TAGS}.${TagsSubTable.ID}

      GROUP BY ${Tables.NEWS_TAGS}.${TagsSubTable.NID}

    ),

    ${SelectAllParts.RESULT} AS (
      SELECT 
        *, ${timestampToInteger(`${bodyPart.CREATED_AT}`, NewsTable.CREATED_AT)} 
      FROM ${Parts.BODY}

      LEFT JOIN ${Parts.IMAGES}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.IMAGES}.${NewsTable.ID}
      LEFT JOIN ${Parts.AUTHOR}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.AUTHOR}.${NewsTable.ID}
      LEFT JOIN ${Parts.TAGS}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.TAGS}.${NewsTable.ID}
    )



  SELECT 
    (SELECT COUNT(*) FROM ${SelectAllParts.RESULT}) as count,
    (
      SELECT json_agg(${SelectAllParts.RESULT}.*) FROM ${SelectAllParts.RESULT}
    ) AS rows;`;
}

const news = {
  createNewsTable: `
    ${newsBody.createNewsTable}
    ${newsTags.createTagsSubTable}
    ${newsImages.createImagesSubTable}
  `,

  insert: `
    WITH RECURSIVE
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
      ),

      ${Parts.TAGS_FULL} AS (
        SELECT * FROM ${Parts.TAGS} 
        LEFT JOIN ${Tables.TAGS}
          ON ${tagsPart.ID} = ${Tables.TAGS}.${TagsTable.ID}
      ),

      ${Parts.CATEGORIES} AS (
        SELECT 
          ${Tables.CATEGORIES}.${CategoriesTable.ID},
          ${Tables.CATEGORIES}.${CategoriesTable.PID},
          ${Tables.CATEGORIES}.${CategoriesTable.NAME},
          1 AS ${Recursive.LEVEL}
        FROM ${Parts.BODY} 
        LEFT JOIN ${Tables.CATEGORIES}
          ON ${bodyPart.CATEGORY} = ${Tables.CATEGORIES}.${CategoriesTable.ID}
        
      
        UNION ALL
      
        SELECT 
          ${Tables.CATEGORIES}.${CategoriesTable.ID}, 
          ${Tables.CATEGORIES}.${CategoriesTable.PID}, 
          ${Tables.CATEGORIES}.${CategoriesTable.NAME}, 
          ${categoriesPart.LEVEL} + 1 AS ${Recursive.LEVEL}
        FROM ${Tables.CATEGORIES}
        JOIN ${Parts.CATEGORIES} 
        ON 
          ${Tables.CATEGORIES}.${CategoriesTable.ID} 
          = 
          ${Parts.CATEGORIES}.${CategoriesTable.PID}
      ),

      ${Parts.IMAGES} AS (
        INSERT INTO ${Tables.NEWS_IMAGES} (${ImagesSubTable.NID}, ${ImagesSubTable.PATH}) 
        SELECT ${bodyPart.ID}, unnest($7::text[]) FROM ${Parts.BODY} 
        RETURNING ${ImagesSubTable.PATH}
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
      (SELECT to_json(${authorPart.ALL}) FROM ${Parts.AUTHOR}) AS ${NewsTable.AUTHOR},
      (SELECT json_agg(${categoriesPart.ALL}) 
          FROM ${Parts.CATEGORIES}) AS ${NewsTable.CATEGORY},
      (SELECT json_agg(${imagesPart.ALL}) FROM ${Parts.IMAGES}) AS ${NewsFields.AUX_IMAGES},
      (SELECT json_agg(${tagsFullPart.ALL}) FROM ${Parts.TAGS_FULL}) AS ${NewsFields.TAGS}
    FROM ${Parts.BODY};`,

  checkAuthor: `
    SELECT ${NewsTable.AUTHOR} FROM ${Tables.NEWS} WHERE ${NewsTable.ID}=$1;
  `,

  select: `
        WITH RECURSIVE
          ${Parts.BODY} AS ( 
            SELECT * FROM ${Tables.NEWS} WHERE ${NewsTable.ID}=$1
          ),

          ${Parts.IMAGES} AS (
            SELECT ${ImagesSubTable.PATH} FROM ${Tables.NEWS_IMAGES} WHERE ${ImagesSubTable.NID}=$1
          ),

          ${Parts.TAGS} AS (
            SELECT ${TagsSubTable.ID} FROM ${Tables.NEWS_TAGS} WHERE ${TagsSubTable.NID}=$1
          ),

        ${Parts.CATEGORIES} AS (
            SELECT 
              ${Tables.CATEGORIES}.${CategoriesTable.ID},
              ${Tables.CATEGORIES}.${CategoriesTable.PID},
              ${Tables.CATEGORIES}.${CategoriesTable.NAME},
              1 AS ${Recursive.LEVEL}
            FROM ${Parts.BODY} 
            LEFT JOIN ${Tables.CATEGORIES}
              ON ${bodyPart.CATEGORY} = ${Tables.CATEGORIES}.${CategoriesTable.ID}
            
          
            UNION ALL
          
            SELECT 
              ${Tables.CATEGORIES}.${CategoriesTable.ID}, 
              ${Tables.CATEGORIES}.${CategoriesTable.PID}, 
              ${Tables.CATEGORIES}.${CategoriesTable.NAME}, 
              ${categoriesPart.LEVEL} + 1 AS ${Recursive.LEVEL}
            FROM ${Tables.CATEGORIES}
            JOIN ${Parts.CATEGORIES} 
            ON 
              ${Tables.CATEGORIES}.${CategoriesTable.ID} 
              = 
              ${Parts.CATEGORIES}.${CategoriesTable.PID}
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
          (SELECT to_json(${authorPart.ALL}) FROM ${Parts.AUTHOR}) AS ${NewsTable.AUTHOR},
          (SELECT json_agg(${categoriesPart.ALL}) 
              FROM ${Parts.CATEGORIES}) AS ${NewsTable.CATEGORY},
          (SELECT json_agg(${imagesPart.ALL}) FROM ${Parts.IMAGES}) AS ${NewsFields.AUX_IMAGES},
          (SELECT json_agg(${tagsFullPart.ALL}) FROM ${Parts.TAGS_FULL}) AS ${NewsFields.TAGS}
        FROM ${Parts.BODY};`,

  delete: `DELETE FROM ${Tables.NEWS} WHERE (${NewsTable.ID}=$1 AND ${NewsTable.AUTHOR}=$2);`,

  update: `
  WITH RECURSIVE
    ${Parts.BODY} AS ( 
        UPDATE ${Tables.NEWS} SET
          ${NewsTable.TITLE}=$3, 
          ${NewsTable.CONTENT}=$4, 
          ${NewsTable.CATEGORY}=$5, 
          ${NewsTable.MAIN_IMAGE}=$6
        WHERE (${NewsTable.ID}=$1 AND ${NewsTable.AUTHOR}=$2 ) RETURNING *
      ),

    test_delete AS (
      DELETE FROM ${Tables.NEWS_TAGS} WHERE ${TagsSubTable.NID}=$1
    ),

    ${Parts.TAGS} AS (
      INSERT INTO ${Tables.NEWS_TAGS} (${TagsSubTable.NID}, ${TagsSubTable.ID}) 
      SELECT ${bodyPart.ID}, unnest($7::integer[]) FROM ${Parts.BODY} 
      RETURNING ${TagsSubTable.ID}
    ),

    ${Parts.TAGS_FULL} AS (
      SELECT * FROM ${Parts.TAGS} 
      LEFT JOIN ${Tables.TAGS}
        ON ${tagsPart.ID} = ${Tables.TAGS}.${TagsTable.ID}
    ),

    ${Parts.CATEGORIES} AS (
      SELECT 
        ${Tables.CATEGORIES}.${CategoriesTable.ID},
        ${Tables.CATEGORIES}.${CategoriesTable.PID},
        ${Tables.CATEGORIES}.${CategoriesTable.NAME},
        1 AS ${Recursive.LEVEL}
      FROM ${Parts.BODY} 
      LEFT JOIN ${Tables.CATEGORIES}
        ON ${bodyPart.CATEGORY} = ${Tables.CATEGORIES}.${CategoriesTable.ID}
      
    
      UNION ALL
    
      SELECT 
        ${Tables.CATEGORIES}.${CategoriesTable.ID}, 
        ${Tables.CATEGORIES}.${CategoriesTable.PID}, 
        ${Tables.CATEGORIES}.${CategoriesTable.NAME}, 
        ${categoriesPart.LEVEL} + 1 AS ${Recursive.LEVEL}
      FROM ${Tables.CATEGORIES}
      JOIN ${Parts.CATEGORIES} 
      ON 
        ${Tables.CATEGORIES}.${CategoriesTable.ID} 
        = 
        ${Parts.CATEGORIES}.${CategoriesTable.PID}
    ),

    test_delete2 AS (
      DELETE FROM ${Tables.NEWS_IMAGES} WHERE ${ImagesSubTable.NID}=$1
    ),

    ${Parts.IMAGES} AS (
      INSERT INTO ${Tables.NEWS_IMAGES} (${ImagesSubTable.NID}, ${ImagesSubTable.PATH}) 
      SELECT ${bodyPart.ID}, unnest($8::text[]) FROM ${Parts.BODY} 
      RETURNING ${ImagesSubTable.PATH}
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
    (SELECT to_json(${authorPart.ALL}) FROM ${Parts.AUTHOR}) AS ${NewsTable.AUTHOR},
    (SELECT json_agg(${categoriesPart.ALL}) 
        FROM ${Parts.CATEGORIES}) AS ${NewsTable.CATEGORY},
    (SELECT json_agg(${imagesPart.ALL}) FROM ${Parts.IMAGES}) AS ${NewsFields.AUX_IMAGES},
    (SELECT json_agg(${tagsFullPart.ALL}) FROM ${Parts.TAGS_FULL}) AS ${NewsFields.TAGS}
  FROM ${Parts.BODY};`,

  selectAll,
} as const;

export { NewsTable, news };
