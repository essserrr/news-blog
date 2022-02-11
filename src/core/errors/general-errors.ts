type GeneralErrorCodes = 'NOT_FOUND' | 'UNKNOWN_ERROR';

const generalErrorHttpCode: Record<GeneralErrorCodes, number> = {
  NOT_FOUND: 404,
  UNKNOWN_ERROR: 500,
};

export type { GeneralErrorCodes };
export { generalErrorHttpCode };
