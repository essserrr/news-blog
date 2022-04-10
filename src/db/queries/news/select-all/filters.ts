import {
  TagFilter,
  CategoryFilter,
  AuthorNameFilter,
  TitleFilter,
  ContentFilter,
  CreatedAtFilter,
  SearchFilter,
  Filters,
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

const selectAllByTag = ({ filter, value }: TagFilter) => {
  const LOCAL_TABLE = 'a';

  const minCount = filter === 'all' ? value.length : 1;

  const whereCondition = value.map((v) => `${TagsSubTable.ID} = '${v}'`);

  return `
    ${SelectAllParts.FILTERED} AS (
  
      SELECT ${LOCAL_TABLE}.${TagsSubTable.NID} as ${NewsTable.ID} FROM
        (SELECT 
          ${TagsSubTable.NID}, count(${TagsSubTable.ID})
        FROM ${Tables.NEWS_TAGS}
        WHERE ${whereCondition.join(' OR ')}
         GROUP BY ${TagsSubTable.NID}
        ) AS ${LOCAL_TABLE}
  
      WHERE ${LOCAL_TABLE}.count >= '${minCount}'
    )
    `;
};

const selectAllByCategory = ({ value }: CategoryFilter) => `
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
  
      WHERE ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL
    )
  `;

const selectAllByAuthorName = ({ value }: AuthorNameFilter) => `
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
        WHERE ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL
    )
  `;

const selectAllByTitle = ({ value }: TitleFilter) => `
    ${SelectAllParts.FILTERED} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.NEWS}
  
      WHERE lower(${NewsTable.TITLE}) LIKE('%${value}%')
    )
  `;

const selectAllByContent = ({ value }: ContentFilter) => `
    ${SelectAllParts.FILTERED} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.NEWS}
  
      WHERE lower(${NewsTable.CONTENT}) LIKE('%${value}%')
    )
  `;

const SIGNS: Record<CreatedAtFilter['filter'], string> = {
  at: '=',
  gt: '>=',
  lt: '<=',
};

const selectAllByCreatedAt = ({ filter, value }: CreatedAtFilter) => `
    ${SelectAllParts.FILTERED} AS (
      SELECT * 
      FROM ${Tables.NEWS} 
      WHERE ${NewsTable.CREATED_AT}::date ${SIGNS[filter]} '${value}'
    )
  `;

const selectAllBySearch = ({ value }: SearchFilter) => {
  const authorsLike = 'authors_l';
  const authorNews = 'authors_n';

  const contentNews = 'content_n';

  const tagsNews = 'tag_n';

  const categoriesLike = 'categories_l';

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
      WHERE ${Tables.NEWS}.${NewsTable.ID} IS NOT NULL
    ),
  
    ${contentNews} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.NEWS}
  
      WHERE lower(${NewsTable.CONTENT}) LIKE('%${value}%')
    ),
  
    ${tagsNews} AS (
      SELECT 
        ${Tables.NEWS_TAGS}.${TagsSubTable.NID}
      FROM ${Tables.TAGS}
  
  
      RIGHT JOIN ${Tables.NEWS_TAGS}
        ON ${Tables.NEWS_TAGS}.${TagsSubTable.ID} = ${Tables.TAGS}.${TagsTable.ID}
  
      WHERE lower(${Tables.TAGS}.${TagsTable.NAME}) LIKE('%${value}%')
    ),
  
    ${categoriesLike} AS (
      SELECT 
        ${Tables.NEWS}.${NewsTable.ID}
      FROM ${Tables.CATEGORIES}
  
  
      RIGHT JOIN ${Tables.NEWS}
        ON ${Tables.NEWS}.${NewsTable.CATEGORY} = ${Tables.CATEGORIES}.${CategoriesTable.ID}
  
      WHERE lower(${Tables.CATEGORIES}.${CategoriesTable.NAME}) LIKE('%${value}%')
    ),
  
    ${SelectAllParts.FILTERED} AS (
      SELECT * FROM ${categoriesLike}
        UNION
      SELECT * FROM ${authorNews}
        UNION
      SELECT * FROM ${contentNews}
        UNION
      SELECT * FROM ${tagsNews}
    )
    `;
};

const selectAll = (_: NoFilter) => `
  ${SelectAllParts.FILTERED} AS (
    SELECT ${NewsTable.ID} FROM ${Tables.NEWS}
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
    default:
      return selectAll(f);
  }
};

export { filters };
