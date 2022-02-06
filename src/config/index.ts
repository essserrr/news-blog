const {
  DATABASE_URL,
  NODE_ENV,
  LOG_LEVEL = 'info',
  PORT: ENV_PORT,
  DATABASE_SSL: ENV_DATABASE_SSL,
} = process.env;

const IS_PRODUCTION = NODE_ENV === 'production';
const DATABASE_SSL = ENV_DATABASE_SSL === 'true';
const PORT = Number(ENV_PORT) || 8000;

export { LOG_LEVEL, PORT, DATABASE_URL, IS_PRODUCTION, DATABASE_SSL };
