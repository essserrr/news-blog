import { Logger } from 'src/core/logger';
import { Database, DatabaseConfig } from 'src/core/database';

import { initTables, connectDb } from './actions/init';
import { getAllTags, getTag, addTag, updateTag, removeTag } from './actions/tags';
import {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
} from './actions/categories';
import { signup, getUser, removeUser } from './actions/users';
import { login, logout, checkPass, checkToken } from './actions/auth';
import { addAuthor, updateAuthor, getAuthor, removeAuthor, getAllAuthors } from './actions/authors';
import { addNews, getNews, updateNews } from './actions/news';

import { DbInstance } from './types';
import queries from './queries';

const initDb = async (logger: Logger, config: DatabaseConfig): Promise<Database> => {
  const pool = await connectDb(logger, config);
  await initTables(pool, logger);

  logger.info('DB created');

  const instance: DbInstance = {
    pool,
    logger,
    queries,
  };

  return {
    tags: {
      getAll: getAllTags(instance),
      get: getTag(instance),
      add: addTag(instance),
      update: updateTag(instance),
      remove: removeTag(instance),
    },
    categories: {
      getAll: getAllCategories(instance),
      get: getCategory(instance),
      add: addCategory(instance),
      update: updateCategory(instance),
      remove: removeCategory(instance),
    },
    users: {
      signup: signup(instance),
      get: getUser(instance),
      remove: removeUser(instance),
    },
    auth: {
      login: login(instance),
      logout: logout(instance),
      checkPass: checkPass(instance),
      checkToken: checkToken(instance),
    },
    authors: {
      getAll: getAllAuthors(instance),
      get: getAuthor(instance),
      add: addAuthor(instance),
      update: updateAuthor(instance),
      remove: removeAuthor(instance),
    },
    news: {
      add: addNews(instance),
      get: getNews(instance),
      update: updateNews(instance),
    },
  };
};

export { initDb };
