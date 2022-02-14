import { v4 as uuidv4 } from 'uuid';
import { Handler, respondWithError } from 'src/core/server';
import { mapSelfUser } from 'src/core/user';
import { getTypedError } from 'src/core/errors';
import { validateQuery } from 'src/core/validation';

const login: Handler = (app) => async (req, res) => {
  try {
    const { username } = validateQuery({ username: req.params.id });
    const authToken = uuidv4();

    const data = await app.db.auth.login(username, { authToken });

    res.send({ data: mapSelfUser(data) });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const logout: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });
    const data = await app.db.auth.logout(uid);

    res.send(data);
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { login, logout };
