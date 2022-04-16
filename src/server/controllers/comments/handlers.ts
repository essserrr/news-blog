import { CommentInsertBody } from 'src/core/remote-client';
import { Handler, respondWithError } from 'src/core/server';
import { getTypedError } from 'src/core/errors';
import { validateReq, validateQuery } from 'src/core/validation';

const getAll: Handler = (app) => async (req, res) => {
  try {
    const { offset = 0, limit = null } = req.query;
    const {
      uid: nid,
      offset: validatedOffset,
      limit: validatedLimit,
    } = validateQuery({ offset, limit, uid: req.params.id });

    const data = await app.db.comments.getAll(nid, validatedOffset, validatedLimit);

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const add: Handler = (app) => async (req, res) => {
  try {
    const { uid: nid } = validateQuery({ uid: req.params.id });

    const { uid, message }: CommentInsertBody = req.body || {};

    const { uid: validatedUid } = validateQuery({ uid });
    const { description: validatedMessage } = validateReq({ description: message });

    const data = await app.db.comments.add({ nid, uid: validatedUid, message: validatedMessage });

    res.send({ data });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const { uid: id } = validateQuery({ uid: req.params.id });
    const data = await app.db.comments.remove(id);

    res.send(data);
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { add, getAll, remove };
