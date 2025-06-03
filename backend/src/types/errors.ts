export class APIError extends Error {
  public code: number;
  public details?: any;

  constructor(code: number, message: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;

    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, APIError.prototype);

    // Optional: Clean stack trace for this error class
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
