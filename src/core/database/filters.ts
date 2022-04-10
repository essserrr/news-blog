interface TagFilter {
  type: 'tag';
  filter: 'in' | 'all';
  value: Array<number>;
}

interface CategoryFilter {
  type: 'category';
  value: number;
}

interface AuthorNameFilter {
  type: 'authorName';
  value: string;
}

interface TitleFilter {
  type: 'title';
  value: string;
}

interface ContentFilter {
  type: 'content';
  value: string;
}

interface CreatedAtFilter {
  type: 'createdAt';
  filter: 'at' | 'gt' | 'lt';
  value: string;
}

interface SearchFilter {
  type: 'search';
  value: string;
}

interface NoFilter {
  type: 'noFilter';
}

type Filters =
  | TagFilter
  | CategoryFilter
  | AuthorNameFilter
  | TitleFilter
  | ContentFilter
  | CreatedAtFilter
  | SearchFilter
  | NoFilter;

export type {
  TagFilter,
  CategoryFilter,
  AuthorNameFilter,
  TitleFilter,
  ContentFilter,
  CreatedAtFilter,
  SearchFilter,
  Filters,
  NoFilter,
};
