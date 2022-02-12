import { tags, TagsTable } from './tags';
import { categories, CategoriesTable } from './categories';

const queries = {
  tags,
  categories,
} as const;

export default queries;
export { Tables } from './tables';
export { TagsTable, CategoriesTable };
