import { Logger as PinoLogger } from 'pino';

export type Logger = Pick<PinoLogger, 'debug' | 'info' | 'error'>;
