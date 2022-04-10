import { SortingType } from 'src/core/database';
import { Sorting } from 'src/core/database/sorting';

import { Tables } from '../../tables';
import { CategoriesTable } from '../../categories';

import { NewsTable } from '../news-body';
import { ImagesSubTable } from '../news-images';
import { authorFullName } from '../news-author';
import { Parts, Recursive } from '../constants';

import { SelectAllFields } from './types';

const KEYWORD_BY_SORTING: Record<SortingType, string> = {
  asc: 'ASC',
  desc: 'DESC',
};

const sortTemplate = (sorting: SortingType) =>
  `
    ORDER BY 
      ${SelectAllFields.SORT} ${KEYWORD_BY_SORTING[sorting]}, 
      ${Parts.BODY}.${NewsTable.ID} DESC
  `;

const noSort = () => ``;

const sortByDate = () => `${Tables.NEWS}.${NewsTable.CREATED_AT} AS ${SelectAllFields.SORT},`;

const sortByPhoto = () => `count(${ImagesSubTable.PATH}) AS ${SelectAllFields.SORT},`;

const sortByCategory = () => `
  string_agg(${Parts.CATEGORIES}.${CategoriesTable.NAME}, '') 
  FILTER (WHERE ${Parts.CATEGORIES}.${Recursive.LEVEL} = 1)
  AS ${SelectAllFields.SORT},
`;

const sortByAuthor = () => `${authorFullName} AS ${SelectAllFields.SORT},`;

const sorting = (s: Sorting): [string, string, Sorting['type']] => {
  switch (s.type) {
    case 'date':
      return [sortTemplate(s.sorting), sortByDate(), s.type];
    case 'author':
      return [sortTemplate(s.sorting), sortByAuthor(), s.type];
    case 'category':
      return [sortTemplate(s.sorting), sortByCategory(), s.type];
    case 'photo':
      return [sortTemplate(s.sorting), sortByPhoto(), s.type];
    default:
      return [noSort(), noSort(), s.type];
  }
};

export { sorting };
