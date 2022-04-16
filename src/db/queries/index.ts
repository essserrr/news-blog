import { tags, TagsTable } from './tags';
import { categories, CategoriesTable } from './categories';
import { users, UsersTable } from './users';
import { authors, AuthorsTable } from './authors';
import { news, NewsTable } from './news';
import { comments, CommentsTable } from './comments';

const queries = {
  tags,
  categories,
  users,
  authors,
  news,
  comments,
} as const;

export default queries;
export { Tables } from './tables';
export { TagsTable, CategoriesTable, UsersTable, AuthorsTable, NewsTable, CommentsTable };
