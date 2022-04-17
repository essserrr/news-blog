import { Filters } from 'src/core/database/filters';
import { validateReq, validateQuery } from 'src/core/validation';

const splitTagString = (tagStr: string) => tagStr.replaceAll(/[[\]]/g, '').split(',');

const filter = (filterOptions: Record<string, unknown>, isDraft: boolean = false): Filters => {
  const {
    created_at: createdAt = null,
    created_at__lt: createdAtLt = null,
    created_at__gt: createdAtGt = null,
    author = null,
    category = null,
    tag = null,
    tag_in: tagIn = null,
    tag_all: tagAll = null,
    title = null,
    content = null,
    search = null,
    author_uid: authorUid = null,
  } = filterOptions;

  switch (true) {
    case createdAt !== null: {
      const { date: value } = validateQuery({
        date: createdAt,
      });
      return { type: 'createdAt', value, filter: 'at', isDraft };
    }
    case createdAtLt !== null: {
      const { date: value } = validateQuery({
        date: createdAtLt,
      });
      return { type: 'createdAt', value, filter: 'lt', isDraft };
    }
    case createdAtGt !== null: {
      const { date: value } = validateQuery({
        date: createdAtGt,
      });
      return { type: 'createdAt', value, filter: 'gt', isDraft };
    }
    case author !== null: {
      const { name: value } = validateReq({
        name: author,
      });
      return { type: 'authorName', value: value.toLowerCase(), isDraft };
    }
    case category !== null: {
      const { categoryId: value } = validateReq({
        categoryId: category,
      });
      return { type: 'category', value, isDraft };
    }
    case title !== null: {
      const { title: value } = validateReq({
        title,
      });
      return { type: 'title', value: value.toLowerCase(), isDraft };
    }
    case content !== null: {
      const { content: value } = validateReq({
        content,
      });
      return { type: 'content', value: value.toLowerCase(), isDraft };
    }
    case search !== null: {
      const { content: value } = validateReq({
        content: search,
      });
      return { type: 'search', value: value.toLowerCase(), isDraft };
    }
    case tag !== null: {
      const { string } = validateQuery({
        string: tag,
      });
      const { tagIds: value } = validateReq({
        tagIds: splitTagString(string),
      });
      return { type: 'tag', value, filter: 'all', isDraft };
    }
    case tagAll !== null: {
      const { string } = validateQuery({
        string: tagAll,
      });
      const { tagIds: value } = validateReq({
        tagIds: splitTagString(string),
      });
      return { type: 'tag', value, filter: 'all', isDraft };
    }
    case tagIn !== null: {
      const { string } = validateQuery({
        string: tagIn,
      });
      const { tagIds: value } = validateReq({
        tagIds: splitTagString(string),
      });
      return { type: 'tag', value, filter: 'in', isDraft };
    }
    case authorUid !== null: {
      const { uid: value } = validateQuery({
        uid: authorUid,
      });
      return { type: 'author', value, isDraft };
    }
    default:
      return { type: 'noFilter' };
  }
};

export { filter };
