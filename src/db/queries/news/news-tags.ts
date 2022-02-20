import { Tables } from '../tables';
import { TagsTable } from '../tags';
import { NewsTable } from '.';

enum NewsTagsTable {
  NID = 'nid',
  ID = 'id',
}

enum TagRules {
  SORT_BY_NID = 'news_tags_nid_sort_asc',
}

const CURRENT_TABLE = Tables.NEWS_TAGS;

const bulkInsert = (nid: string, tags: Array<{ id: number }>) =>
  `INSERT INTO ${CURRENT_TABLE} (${NewsTagsTable.NID}, ${NewsTagsTable.ID}) VALUES ${tags
    .map((newsTag) => `('${nid}', ${newsTag.id})`)
    .join(', ')} RETURNING ${NewsTagsTable.ID};` as const;

const newsTags = {
  createNewsTagsTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${NewsTagsTable.NID} serial NOT NULL REFERENCES ${Tables.NEWS} (${NewsTable.ID}) ON DELETE CASCADE,
        ${NewsTagsTable.ID} serial NOT NULL REFERENCES ${Tables.TAGS} (${TagsTable.ID}) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS ${TagRules.SORT_BY_NID} ON ${CURRENT_TABLE} USING btree (${NewsTagsTable.NID} ASC);
`,

  select: `SELECT ${NewsTagsTable.ID} FROM ${CURRENT_TABLE} WHERE ${NewsTagsTable.NID}=$1;`,

  put: (nid: string, tags: Array<{ id: number }>) =>
    `
    DELETE FROM ${CURRENT_TABLE} WHERE ${NewsTagsTable.NID}='${nid}';
    ${bulkInsert(nid, tags)}
  ` as const,
} as const;

export { NewsTagsTable, TagRules, newsTags };
