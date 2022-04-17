type Draftable<T> = T & { isDraft: boolean };

type TagFilter = Draftable<{
  type: 'tag';
  filter: 'in' | 'all';
  value: Array<number>;
}>;

type CategoryFilter = Draftable<{
  type: 'category';
  value: number;
}>;

type AuthorNameFilter = Draftable<{
  type: 'authorName';
  value: string;
}>;

type TitleFilter = Draftable<{
  type: 'title';
  value: string;
}>;

type ContentFilter = Draftable<{
  type: 'content';
  value: string;
}>;

type CreatedAtFilter = Draftable<{
  type: 'createdAt';
  filter: 'at' | 'gt' | 'lt';
  value: string;
}>;

type SearchFilter = Draftable<{
  type: 'search';
  value: string;
}>;

type AuthorFilter = Draftable<{
  type: 'author';
  value: string;
}>;

type NoFilter = Draftable<{
  type: 'noFilter';
}>;

type Filters =
  | TagFilter
  | CategoryFilter
  | AuthorNameFilter
  | TitleFilter
  | ContentFilter
  | CreatedAtFilter
  | SearchFilter
  | AuthorFilter
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
  AuthorFilter,
  NoFilter,
};
