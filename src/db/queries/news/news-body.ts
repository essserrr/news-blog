import { Tables } from '../tables';
import { AuthorsTable } from '../authors';
import { CategoriesTable } from '../categories';

enum NewsBodyTable {
  ID = 'id',
  AUTHOR = 'author',
  TITLE = 'title',
  CONTENT = 'content',
  CATEGORY = 'category',
  MAIN_IMAGE = 'main_image',
  CREATED_AT = 'created_at',
}

const CURRENT_TABLE = Tables.NEWS;

const newsBody = {
  createNewsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${NewsBodyTable.ID} bigserial NOT NULL PRIMARY KEY,
        ${NewsBodyTable.AUTHOR} bigserial REFERENCES ${Tables.AUTHORS} (${AuthorsTable.UID}) ON DELETE SET NULL,
        ${NewsBodyTable.TITLE} text NOT NULL,
        ${NewsBodyTable.CONTENT} text NOT NULL,
        ${NewsBodyTable.CATEGORY} serial REFERENCES ${Tables.CATEGORIES} (${CategoriesTable.ID}) ON DELETE SET NULL,
        ${NewsBodyTable.MAIN_IMAGE} text NOT NULL,
        ${NewsBodyTable.CREATED_AT} TIMESTAMP NOT NULL DEFAULT NOW()
    );
`,
} as const;

export { NewsBodyTable, newsBody };
