export class ApiError extends Error {
  statusCode: number;
  errors?: string[];
  isOperational = true;

  constructor(message: string, statusCode = 500, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
