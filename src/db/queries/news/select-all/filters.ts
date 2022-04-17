import {
  TagFilter,
  CategoryFilter,
  AuthorNameFilter,
  TitleFilter,
  ContentFilter,
  CreatedAtFilter,
  SearchFilter,
  Filters,
  AuthorFilter,
  NoFilter,
} from 'src/core/database/filters';

import { Tables } from '../../tables';
import { AuthorsTable } from '../../authors';
import { TagsTable } from '../../tags';
import { UsersTable } from '../../users';
import { CategoriesTable } from '../../categories';

import { TagsSubTable } from '../news-tags';
import { NewsTable } from '../news-body';

import { SelectAllParts } from './types';

const selectAllByTag = ({ filter, value, isDraft }: TagFilter) => {
  const LOCAL_TABLE = 'a';

  const minCount = filter === 'all' ? value.length : 1;

  const whereCondition = value.map((v) => `${TagsSubTable.ID} = '${v}'`);

  return `
    ${SelectAllParts.PRE_FILTERED} AS (
  
      SELECT ${LOCAL_TABLE}.${TagsSubTable.NID} FROM
        (SELECT 
          ${TagsSubTable.NID}, count(${TagsSubTable.ID})
        FROM ${Tables.NEWS_TAGS}
        WHERE ${whereCondition.join(' OR ')}
         GROUP BY ${TagsSubTable.NID}
        ) AS ${LOCAL_TABLE}
  
      WHERE ${LOCAL_TABLE}.count >= '${minCount}'
    ),

    ${SelectAllParts.FILTERED} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${SelectAllParts.PRE_FILTERED}


      LEFT JOIN ${Tables.NEWS}
        ON ${SelectAllParts.PRE_FILTERED}.${TagsSubTable.NID} = ${Tables.NEWS}.${NewsTable.ID}
          
      WHERE 
        ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL 
          AND 
        ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
  )
    `;
};

const selectAllByCategory = ({ value, isDraft }: CategoryFilter) => `
    ${SelectAllParts.PRE_FILTERED} AS (
      SELECT 
        ${Tables.CATEGORIES}.${CategoriesTable.ID}, 
        ${Tables.CATEGORIES}.${CategoriesTable.PID}
      FROM ${Tables.CATEGORIES} 
      WHERE ${Tables.CATEGORIES}.${CategoriesTable.ID} = '${value}'
  
      UNION ALL
  
      SELECT 
        ${Tables.CATEGORIES}.${CategoriesTable.ID}, 
        ${Tables.CATEGORIES}.${CategoriesTable.PID}
      FROM ${Tables.CATEGORIES}
      JOIN ${SelectAllParts.PRE_FILTERED} 
        ON 
          ${Tables.CATEGORIES}.${CategoriesTable.PID} 
          = 
          ${SelectAllParts.PRE_FILTERED}.${CategoriesTable.ID}
    ),
  
    ${SelectAllParts.FILTERED} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${SelectAllParts.PRE_FILTERED}
  
  
      LEFT JOIN ${Tables.NEWS}
        ON ${SelectAllParts.PRE_FILTERED}.${CategoriesTable.ID} = ${Tables.NEWS}.${NewsTable.CATEGORY}
  
      WHERE ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL AND ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
    )
  `;

const selectAllByAuthorName = ({ value, isDraft }: AuthorNameFilter) => `
    ${SelectAllParts.PRE_FILTERED} AS (
        SELECT 
          ${Tables.USERS}.${UsersTable.UID}
        FROM  ${Tables.AUTHORS}
    
    
        LEFT JOIN ${Tables.USERS}
          ON ${Tables.AUTHORS}.${AuthorsTable.UID} = ${Tables.USERS}.${UsersTable.UID}
  
        WHERE lower(${UsersTable.NAME} || ' ' || ${UsersTable.SECOND_NAME}) LIKE('%${value}%')
    ),
  
  
    ${SelectAllParts.FILTERED} AS (
        SELECT 
          ${Tables.NEWS}.${NewsTable.ID}
        FROM ${SelectAllParts.PRE_FILTERED}
  
  
        LEFT JOIN ${Tables.NEWS}
          ON ${SelectAllParts.PRE_FILTERED}.${UsersTable.UID} = ${Tables.NEWS}.${NewsTable.AUTHOR}
            
        WHERE ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL AND ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
    )
  `;

const selectAllByTitle = ({ value, isDraft }: TitleFilter) => `
    ${SelectAllParts.FILTERED} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.NEWS}
  
      WHERE lower(${NewsTable.TITLE}) LIKE('%${value}%') AND ${NewsTable.IS_DRAFT}='${isDraft}'
    )
  `;

const selectAllByContent = ({ value, isDraft }: ContentFilter) => `
    ${SelectAllParts.FILTERED} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.NEWS}
  
      WHERE lower(${NewsTable.CONTENT}) LIKE('%${value}%') AND ${NewsTable.IS_DRAFT}='${isDraft}'
    )
  `;

const SIGNS: Record<CreatedAtFilter['filter'], string> = {
  at: '=',
  gt: '>=',
  lt: '<=',
};

const selectAllByCreatedAt = ({ filter, value, isDraft }: CreatedAtFilter) => `
    ${SelectAllParts.FILTERED} AS (
      SELECT * 
      FROM ${Tables.NEWS} 
      WHERE ${NewsTable.CREATED_AT}::date ${SIGNS[filter]} '${value}' AND ${NewsTable.IS_DRAFT}='${isDraft}'
    )
  `;

const selectAllBySearch = ({ value, isDraft }: SearchFilter) => {
  const authorsLike = 'authors_l';
  const authorNews = 'authors_n';

  const contentNews = 'content_n';

  const tagsNews = 'tag_n';

  const categoriesNews = 'categories_n';

  return `
    ${authorsLike} AS (
      SELECT 
        ${Tables.USERS}.${UsersTable.UID}
      FROM  ${Tables.AUTHORS}
  
  
      LEFT JOIN ${Tables.USERS}
        ON ${Tables.AUTHORS}.${AuthorsTable.UID} = ${Tables.USERS}.${UsersTable.UID}
  
      WHERE lower(${UsersTable.NAME} || ' ' || ${UsersTable.SECOND_NAME}) LIKE('%${value}%')
    ),
  
  
    ${authorNews} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${authorsLike}
  
  
      LEFT JOIN ${Tables.NEWS}
        ON ${authorsLike}.${UsersTable.UID} = ${Tables.NEWS}.${NewsTable.AUTHOR}
      WHERE ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL AND ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
    ),
  
    ${contentNews} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.NEWS}
  
      WHERE lower(${NewsTable.CONTENT}) LIKE('%${value}%') AND ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
    ),
  
    ${tagsNews} AS (
      SELECT 
        ${Tables.NEWS_TAGS}.${TagsSubTable.NID} AS ${NewsTable.ID}
      FROM ${Tables.TAGS}
  
  
      RIGHT JOIN ${Tables.NEWS_TAGS}
        ON ${Tables.NEWS_TAGS}.${TagsSubTable.ID} = ${Tables.TAGS}.${TagsTable.ID}
      RIGHT JOIN ${Tables.NEWS}
        ON ${Tables.NEWS}.${NewsTable.ID} = ${Tables.NEWS_TAGS}.${TagsSubTable.NID} 

      WHERE lower(${Tables.TAGS}.${TagsTable.NAME}) LIKE('%${value}%') AND ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
    ),

 
    ${categoriesNews} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.CATEGORIES}
  
  
      RIGHT JOIN ${Tables.NEWS}
        ON ${Tables.NEWS}.${NewsTable.CATEGORY} = ${Tables.CATEGORIES}.${CategoriesTable.ID}
  
      WHERE lower(${Tables.CATEGORIES}.${CategoriesTable.NAME}) LIKE('%${value}%') AND ${Tables.NEWS}.${NewsTable.IS_DRAFT}='${isDraft}'
    ),
  
    ${SelectAllParts.FILTERED} AS (
      SELECT * FROM ${categoriesNews}
        UNION
      SELECT * FROM ${authorNews}
        UNION
      SELECT * FROM ${contentNews}
        UNION
      SELECT * FROM ${tagsNews}
    )
    `;
};

const selectAllByAuthor = ({ value, isDraft }: AuthorFilter) => `
      ${SelectAllParts.FILTERED} AS (
        SELECT * 
        FROM ${Tables.NEWS} 
        WHERE (${NewsTable.AUTHOR}='${value}' AND ${NewsTable.IS_DRAFT}='${isDraft}')
      )
  `;

const selectAll = ({ isDraft }: NoFilter) => `
  ${SelectAllParts.FILTERED} AS (
    SELECT ${NewsTable.ID} FROM ${Tables.NEWS}
    WHERE ${NewsTable.IS_DRAFT}='${isDraft}'
  )
`;

const filters = (f: Filters) => {
  switch (f.type) {
    case 'tag':
      return selectAllByTag(f);
    case 'category':
      return selectAllByCategory(f);
    case 'authorName':
      return selectAllByAuthorName(f);
    case 'title':
      return selectAllByTitle(f);
    case 'content':
      return selectAllByContent(f);
    case 'createdAt':
      return selectAllByCreatedAt(f);
    case 'search':
      return selectAllBySearch(f);
    case 'author':
      return selectAllByAuthor(f);
    default:
      return selectAll(f);
  }
};

export { filters };
