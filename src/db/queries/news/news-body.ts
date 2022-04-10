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

enum BodyRules {
  SORT_BY_CREATED_AT = 'news_body_created_at_sort_desc',
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

    CREATE INDEX IF NOT EXISTS ${BodyRules.SORT_BY_CREATED_AT} 
      ON ${CURRENT_TABLE} 
    USING btree (${NewsTable.CREATED_AT} DESC);
`,
} as const;

export { NewsTable, newsBody };
