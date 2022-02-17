import { tags, TagsTable } from './tags';
import { categories, CategoriesTable } from './categories';
import { users, UsersTable } from './users';
import { authors, AuthorsTable } from './authors';

const queries = {
  tags,
  categories,
  users,
  authors,
} as const;

export default queries;
export { Tables } from './tables';
export { TagsTable, CategoriesTable, UsersTable, AuthorsTable };
