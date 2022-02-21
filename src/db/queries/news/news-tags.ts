import { Tables } from '../tables';
import { TagsTable } from '../tags';
import { NewsBodyTable } from './news-body';

enum NewsTagsTable {
  NID = 'nid',
  ID = 'id',
}

enum TagRules {
  SORT_BY_NID = 'news_tags_nid_sort_asc',
}

const CURRENT_TABLE = Tables.NEWS_TAGS;

const newsTags = {
  createNewsTagsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${NewsTagsTable.NID} serial NOT NULL 
        REFERENCES ${Tables.NEWS} (${NewsBodyTable.ID}) ON DELETE CASCADE,

        ${NewsTagsTable.ID} serial NOT NULL 
        REFERENCES ${Tables.TAGS} (${TagsTable.ID}) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS ${TagRules.SORT_BY_NID} 
    ON ${CURRENT_TABLE} 
    USING btree (${NewsTagsTable.NID} ASC);
`,
} as const;

export { NewsTagsTable, TagRules, newsTags };
