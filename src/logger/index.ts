import pino from 'pino';
import { Logger } from 'src/core/logger';

const initLogger = (level: string): Logger => {
  const logger = pino({ level });
  logger.debug(`Logger created with level: ${level}`);
  return logger;
};

export { initLogger };
