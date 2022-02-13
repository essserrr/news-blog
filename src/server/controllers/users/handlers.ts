import { hashSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserSignupBody } from 'src/core/remote-client';
import { Handler, respondWithError, mapUser, mapSelfUser } from 'src/core/server';
import { getTypedError } from 'src/core/errors';
import { validateReq, validateQuery } from 'src/core/validation';
import { SALT_ROUNDS } from 'src/config';

const get: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });
    const data = await app.db.users.get(uid);

    res.send({ data: mapUser(data) });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const signup: Handler = (app) => async (req, res) => {
  try {
    const { username } = validateReq({ username: req.params.id });

    const { name, secondName, password, avatar }: UserSignupBody = req.body;
    const {
      name: validatedName,
      secondName: validatedSecondName,
      password: validatedPassword,
      avatar: validatedAvatar,
    } = validateReq({
      name,
      secondName,
      password,
      avatar,
    });

    const hashedPassword = hashSync(validatedPassword, SALT_ROUNDS);

    const authToken = uuidv4();

    const data = await app.db.users.signup({
      name: validatedName,
      secondName: validatedSecondName,
      username,
      password: hashedPassword,
      avatar: validatedAvatar,
      authToken,
    });

    res.send({ data: mapSelfUser(data) });
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

const remove: Handler = (app) => async (req, res) => {
  try {
    const { uid } = validateQuery({ uid: req.params.id });
    const data = await app.db.users.remove(uid);

    res.send(data);
  } catch (e) {
    respondWithError(app, res, getTypedError(e));
  }
};

export { signup, get, remove };
