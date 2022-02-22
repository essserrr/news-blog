import { Tables } from '../tables';
import { NewsTable } from './news-body';

enum ImagesSubTable {
  NID = 'nid',
  PATH = 'path',
}

/*
        SELECT ${bodyPart.ALL} FROM ${Parts.BODY}
          (SELECT to_json(${authorPart.ALL}) FROM ${Parts.AUTHOR}) AS ${NewsTable.AUTHOR},
          (SELECT json_agg(${imagesPart.ALL}) FROM ${Parts.IMAGES}) AS ${NewsFields.AUX_IMAGES},
          (SELECT json_agg(${tagsFullPart.ALL}) FROM ${Parts.TAGS_FULL}) AS ${NewsFields.TAGS}

*/

enum ImagesRules {
  SORT_BY_NID = 'news_images_nid_sort_asc',
}

const CURRENT_TABLE = Tables.NEWS_IMAGES;

const newsImages = {
  createImagesSubTable: `CREATE TABLE IF NOT EXISTS ${CURRENT_TABLE}(
        ${ImagesSubTable.NID} serial NOT NULL 
        REFERENCES ${Tables.NEWS} (${NewsTable.ID}) ON DELETE CASCADE,

        ${ImagesSubTable.PATH} text NOT NULL 
    );

    CREATE INDEX IF NOT EXISTS ${ImagesRules.SORT_BY_NID} 
    ON ${CURRENT_TABLE} 
    USING btree (${ImagesSubTable.NID} ASC);
`,
} as const;

export { ImagesSubTable, ImagesRules, newsImages };
