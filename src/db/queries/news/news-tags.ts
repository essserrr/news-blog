import { Tables } from '../tables';
import { TagsTable } from '../tags';
import { NewsTable } from './news-body';

enum TagsSubTable {
  NID = 'nid',
  ID = 'id',
}

enum TagRules {
  SORT_BY_NID = 'news_tags_nid_sort_asc',
}

const CURRENT_TABLE = Tables.NEWS_TAGS;

const newsTags = {
  createTagsSubTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${TagsSubTable.NID} serial NOT NULL 
        REFERENCES ${Tables.NEWS} (${NewsTable.ID}) ON DELETE CASCADE,

        ${TagsSubTable.ID} serial NOT NULL 
        REFERENCES ${Tables.TAGS} (${TagsTable.ID}) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS ${TagRules.SORT_BY_NID} 
    ON ${CURRENT_TABLE} 
    USING btree (${TagsSubTable.NID} ASC);
`,
} as const;

export { TagsSubTable, TagRules, newsTags };
