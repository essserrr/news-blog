import { Offset, Limit } from 'src/core/database';
import { Filters } from 'src/core/database/filters';
import { Sorting } from 'src/core/database/sorting';

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
import { sorting } from './sorting';
import { limitation } from './limitation';

function selectAll(f: Filters, s: Sorting, o: Offset, l: Limit) {
  const filterQuery = filters(f);
  const [sortingQuery, sortField, sortType] = sorting(s);
  const limitQuery = limitation(o, l);

  return `
  WITH RECURSIVE
    ${filterQuery},

    ${Parts.BODY} AS (
      SELECT 
        ${sortType === 'date' ? sortField : ''}
        ${Tables.NEWS}.*
        
      FROM ${SelectAllParts.FILTERED}
      

      LEFT JOIN ${Tables.NEWS}
        ON ${SelectAllParts.FILTERED}.${NewsTable.ID} = ${Tables.NEWS}.${NewsTable.ID}
    ),

    ${Parts.IMAGES} AS (
      SELECT 
        ${sortType === 'photo' ? sortField : ''}
        ${SelectAllParts.FILTERED}.${NewsTable.ID},
        NULLIF(array_agg(${ImagesSubTable.PATH}), '{NULL}') as ${NewsFields.AUX_IMAGES}  
      FROM ${SelectAllParts.FILTERED}

      LEFT JOIN ${Tables.NEWS_IMAGES}
        ON ${SelectAllParts.FILTERED}.${NewsTable.ID} = ${Tables.NEWS_IMAGES}.${ImagesSubTable.NID}
      
      GROUP BY ${SelectAllParts.FILTERED}.${NewsTable.ID}
    ),

    ${Parts.AUTHOR} AS (
      SELECT * FROM (
        SELECT
          ${Parts.BODY}.${NewsTable.ID},
          ${sortType === 'author' ? sortField : ''}
          jsonb_build_object(${authorObject}) AS ${NewsTable.AUTHOR}
        FROM ${Parts.BODY} 

        LEFT JOIN ${Tables.AUTHORS}
          ON ${Parts.BODY}.${NewsTable.AUTHOR} = ${Tables.AUTHORS}.${AuthorsTable.UID}
        LEFT JOIN ${Tables.USERS}
          ON ${Parts.BODY}.${NewsTable.AUTHOR} = ${Tables.USERS}.${UsersTable.UID} 
      ) AS author_temp
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
          ${sortType === 'category' ? sortField : ''}
          ${Parts.CATEGORIES}.${TagsSubTable.NID} AS ${NewsTable.ID},
          NULLIF(array_agg(jsonb_build_object(${categoryObject})), '{NULL}') AS ${
    NewsTable.CATEGORY
  }
        FROM ${Parts.CATEGORIES} 
        GROUP BY ${Parts.CATEGORIES}.${TagsSubTable.NID}
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

      ${sortingQuery} ${limitQuery}
    )



  SELECT 
    (SELECT COUNT(*) FROM ${SelectAllParts.RESULT}) as count,
    (
      SELECT json_agg(${SelectAllParts.RESULT}.*) FROM ${SelectAllParts.RESULT}
    ) AS rows;`;
}

export { selectAll };
