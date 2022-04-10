import { SortingType } from './entities';

interface DateSort {
  type: 'date';
  sorting: SortingType;
}

interface AuthorSort {
  type: 'author';
  sorting: SortingType;
}

interface CategorySort {
  type: 'category';
  sorting: SortingType;
}

interface PhotoSort {
  type: 'photo';
  sorting: SortingType;
}

interface NoSort {
  type: 'noSort';
}

type Sorting = DateSort | AuthorSort | CategorySort | PhotoSort | NoSort;

export type { DateSort, AuthorSort, CategorySort, PhotoSort, NoSort, Sorting };
