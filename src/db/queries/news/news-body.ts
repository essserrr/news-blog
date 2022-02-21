import { Tables } from '../tables';
import { AuthorsTable } from '../authors';
import { CategoriesTable } from '../categories';

enum NewsTable {
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
        ${NewsTable.ID} bigserial NOT NULL PRIMARY KEY,
        ${NewsTable.AUTHOR} bigserial REFERENCES ${Tables.AUTHORS} (${AuthorsTable.UID}) ON DELETE SET NULL,
        ${NewsTable.TITLE} text NOT NULL,
        ${NewsTable.CONTENT} text NOT NULL,
        ${NewsTable.CATEGORY} serial REFERENCES ${Tables.CATEGORIES} (${CategoriesTable.ID}) ON DELETE SET NULL,
        ${NewsTable.MAIN_IMAGE} text NOT NULL,
        ${NewsTable.CREATED_AT} TIMESTAMP NOT NULL DEFAULT NOW()
    );
`,
} as const;

export { NewsTable, newsBody };
