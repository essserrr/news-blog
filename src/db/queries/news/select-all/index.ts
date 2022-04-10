import { Filters } from 'src/core/database/filters';

import { Tables } from '../../tables';
import { timestampToInteger } from '../../converters';
import { AuthorsTable } from '../../authors';
import { TagsTable } from '../../tags';
import { UsersTable } from '../../users';
import { CategoriesTable } from '../../categories';

import { TagsSubTable, tagsObject } from '../news-tags';
import { NewsTable } from '../news-body';
import { ImagesSubTable } from '../news-images';
import { authorObject } from '../news-author';
import { categoryObject } from '../news-category';
import { Parts, NewsFields, Recursive } from '../constants';

import { SelectAllParts } from './types';
import { filters } from './filters';

function selectAll(f: Filters) {
  const filterQuery = filters(f);

  return `
  WITH RECURSIVE
    ${filterQuery},

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

    ${Parts.CATEGORIES} AS (
      SELECT 
        ${Parts.BODY}.${NewsTable.ID} AS ${TagsSubTable.NID},
        ${Tables.CATEGORIES}.${CategoriesTable.ID},
        ${Tables.CATEGORIES}.${CategoriesTable.PID},
        ${Tables.CATEGORIES}.${CategoriesTable.NAME},
        1 AS ${Recursive.LEVEL}
      FROM ${Parts.BODY} 
      LEFT JOIN ${Tables.CATEGORIES}
        ON ${Parts.BODY}.${NewsTable.CATEGORY} = ${Tables.CATEGORIES}.${CategoriesTable.ID}
      
      UNION ALL
    
      SELECT 
        ${Parts.CATEGORIES}.${TagsSubTable.NID},
        ${Tables.CATEGORIES}.${CategoriesTable.ID}, 
        ${Tables.CATEGORIES}.${CategoriesTable.PID}, 
        ${Tables.CATEGORIES}.${CategoriesTable.NAME}, 
        ${Parts.CATEGORIES}.${Recursive.LEVEL} + 1 AS ${Recursive.LEVEL}
      FROM ${Tables.CATEGORIES}
      JOIN ${Parts.CATEGORIES} 
      ON 
        ${Tables.CATEGORIES}.${CategoriesTable.ID} 
        = 
        ${Parts.CATEGORIES}.${CategoriesTable.PID}

    ),

    ${Parts.CATEGORIES_FULL} AS (
        SELECT 
          ${Parts.CATEGORIES}.${TagsSubTable.NID} AS ${NewsTable.ID},
          NULLIF(array_agg(jsonb_build_object(${categoryObject})), '{NULL}') AS ${
    NewsTable.CATEGORY
  }
        FROM ${Parts.CATEGORIES} 
        GROUP BY ${Parts.CATEGORIES}.${TagsSubTable.NID}
    ),

    ${SelectAllParts.RESULT} AS (
      SELECT 
        *, ${timestampToInteger(`${Parts.BODY}.${NewsTable.CREATED_AT}`, NewsTable.CREATED_AT)} 
      FROM ${Parts.BODY}

      LEFT JOIN ${Parts.IMAGES}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.IMAGES}.${NewsTable.ID}
      LEFT JOIN ${Parts.AUTHOR}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.AUTHOR}.${NewsTable.ID}
      LEFT JOIN ${Parts.TAGS}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.TAGS}.${NewsTable.ID}
      LEFT JOIN ${Parts.CATEGORIES_FULL}
        ON ${Parts.BODY}.${NewsTable.ID} = ${Parts.CATEGORIES_FULL}.${NewsTable.ID}
    )



  SELECT 
    (SELECT COUNT(*) FROM ${SelectAllParts.RESULT}) as count,
    (
      SELECT json_agg(${SelectAllParts.RESULT}.*) FROM ${SelectAllParts.RESULT}
    ) AS rows;`;
}

export { selectAll };

/*
`
  WITH RECURSIVE
    ${filterQuery},

    ${SelectAllParts.RESULT} AS (
      SELECT 
        * 
      FROM ${SelectAllParts.FILTERED}
    )

  SELECT 
    (SELECT COUNT(*) FROM ${SelectAllParts.RESULT}) as count,
    (
      SELECT json_agg(${SelectAllParts.RESULT}.*) FROM ${SelectAllParts.RESULT}
    ) AS rows;`;
*/
