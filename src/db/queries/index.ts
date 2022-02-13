import { tags, TagsTable } from './tags';
import { categories, CategoriesTable } from './categories';
import { users, UsersTable } from './users';

const queries = {
  tags,
  categories,
  users,
} as const;

export default queries;
export { Tables } from './tables';
export { TagsTable, CategoriesTable, UsersTable };
