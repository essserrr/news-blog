import { Logger as PinoLogger } from 'pino';

type Logger = Pick<PinoLogger, 'debug' | 'info' | 'error'>;

export type { Logger };
