import { Filters } from 'src/core/database/filters';
import { validateReq, validateQuery } from 'src/core/validation';
import { AppError } from 'src/core/errors';

const splitTagString = (tagStr: string) => tagStr.replaceAll(/[[\]]/g, '').split(',');

const filter = (filterOptions: Record<string, unknown>): Filters => {
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
  } = filterOptions;

  switch (true) {
    case createdAt !== null: {
      const { date: value } = validateQuery({
        date: createdAt,
      });
      return { type: 'createdAt', value, filter: 'at' };
    }
    case createdAtLt !== null: {
      const { date: value } = validateQuery({
        date: createdAtLt,
      });
      return { type: 'createdAt', value, filter: 'lt' };
    }
    case createdAtGt !== null: {
      const { date: value } = validateQuery({
        date: createdAtGt,
      });
      return { type: 'createdAt', value, filter: 'gt' };
    }
    case author !== null: {
      const { name: value } = validateReq({
        name: author,
      });
      return { type: 'authorName', value: value.toLowerCase() };
    }
    case category !== null: {
      const { categoryId: value } = validateReq({
        categoryId: category,
      });
      return { type: 'category', value };
    }
    case title !== null: {
      const { title: value } = validateReq({
        title,
      });
      return { type: 'title', value: value.toLowerCase() };
    }
    case content !== null: {
      const { content: value } = validateReq({
        content,
      });
      return { type: 'content', value: value.toLowerCase() };
    }
    case search !== null: {
      const { content: value } = validateReq({
        content: search,
      });
      return { type: 'search', value: value.toLowerCase() };
    }
    case tag !== null: {
      const { string } = validateQuery({
        string: tag,
      });
      const { tagIds: value } = validateReq({
        tagIds: splitTagString(string),
      });
      return { type: 'tag', value, filter: 'all' };
    }
    case tagAll !== null: {
      const { string } = validateQuery({
        string: tagAll,
      });
      const { tagIds: value } = validateReq({
        tagIds: splitTagString(string),
      });
      return { type: 'tag', value, filter: 'all' };
    }
    case tagIn !== null: {
      const { string } = validateQuery({
        string: tagIn,
      });
      const { tagIds: value } = validateReq({
        tagIds: splitTagString(string),
      });
      return { type: 'tag', value, filter: 'in' };
    }
    default:
      throw new AppError({ code: 'WRONG_FORMAT', errorType: 'Validation error' });
  }
};

export { filter };
