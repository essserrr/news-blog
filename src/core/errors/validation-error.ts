type ValidationErrorCodes = 'WRONG_FORMAT';

const validationErrorHttpCodes: Record<ValidationErrorCodes, number> = {
  WRONG_FORMAT: 400,
};

export { validationErrorHttpCodes };
export type { ValidationErrorCodes };
