import { Handler, respondWithError } from 'src/core/server';
import { AppError } from 'src/core/errors';

const notFound: Handler = (app) => async (req, res) => {
  respondWithError(app, res, new AppError({ code: 'NOT_FOUND' }));
};

export { notFound };
