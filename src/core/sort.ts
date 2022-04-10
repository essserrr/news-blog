import { Sorting } from 'src/core/database/sorting';
import { validateQuery } from 'src/core/validation';

const sort = (sortOptions: Record<string, unknown>): Sorting => {
  const {
    sort_date: sortDate = null,
    sort_author: sortAuthor = null,
    sort_category: sortCategory = null,
    sort_photo: sortPhoto = null,
  } = sortOptions;

  switch (true) {
    case sortDate !== null: {
      const { sorting } = validateQuery({
        sorting: sortDate,
      });
      return { type: 'date', sorting };
    }
    case sortAuthor !== null: {
      const { sorting } = validateQuery({
        sorting: sortAuthor,
      });
      return { type: 'author', sorting };
    }
    case sortCategory !== null: {
      const { sorting } = validateQuery({
        sorting: sortCategory,
      });
      return { type: 'category', sorting };
    }
    case sortPhoto !== null: {
      const { sorting } = validateQuery({
        sorting: sortPhoto,
      });
      return { type: 'photo', sorting };
    }
    default:
      return { type: 'noSort' };
  }
};

export { sort };
