import { Tables } from '../tables';
import { timestampToInteger } from '../converters';
import { AuthorsTable } from '../authors';
import { TagsTable } from '../tags';
import { UsersTable } from '../users';
import { CategoriesTable } from '../categories';

import { newsTags, TagsSubTable } from './news-tags';
import { newsBody, NewsTable } from './news-body';
import { newsImages, ImagesSubTable } from './news-images';
import { author } from './news-author';
import { Parts, NewsFields, Recursive } from './constants';
import { selectAll, selectAllDrafts } from './select-all';

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

const categoriesPart = {
  ALL: `${Parts.CATEGORIES}.*`,
  LEVEL: `${Parts.CATEGORIES}.${Recursive.LEVEL}`,
} as const;

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
            ${NewsTable.MAIN_IMAGE}, 
            ${NewsTable.IS_DRAFT}
          ) VALUES ($1, $2, $3, $4, $5, $8) RETURNING *
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
    SELECT ${NewsTable.AUTHOR} FROM ${Tables.NEWS} WHERE (${NewsTable.ID}=$1 AND ${NewsTable.IS_DRAFT}=$2);
  `,

  select: `
        WITH RECURSIVE
          ${Parts.BODY} AS ( 
            SELECT * FROM ${Tables.NEWS} WHERE ${NewsTable.ID}=$1 AND ${NewsTable.IS_DRAFT}=$2
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

  delete: `DELETE FROM ${Tables.NEWS} WHERE ${NewsTable.ID}=$1;`,

  update: `
  WITH RECURSIVE
    ${Parts.BODY} AS ( 
        UPDATE ${Tables.NEWS} SET
          ${NewsTable.TITLE}=$2, 
          ${NewsTable.CONTENT}=$3, 
          ${NewsTable.CATEGORY}=$4, 
          ${NewsTable.MAIN_IMAGE}=$5
        WHERE ${NewsTable.ID}=$1 RETURNING *
      ),

    clear_tags AS (
      DELETE FROM ${Tables.NEWS_TAGS} WHERE ${TagsSubTable.NID}=$1
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

    clear_images AS (
      DELETE FROM ${Tables.NEWS_IMAGES} WHERE ${ImagesSubTable.NID}=$1
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

  publish: `
  UPDATE ${Tables.NEWS} SET
    ${NewsTable.IS_DRAFT}='false'
  WHERE (${NewsTable.ID}=$1 AND ${NewsTable.IS_DRAFT}='true');`,

  selectAll,
  selectAllDrafts,
} as const;

export { NewsTable, news };
