/* eslint-disable max-classes-per-file */
class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

class AuthenticationError extends HttpException {
  constructor(status: number, message: string) {
    super(status, message);
    this.name = 'AuthenticationError';
  }
}

class DatabaseError extends HttpException {
  constructor(status: number, message: string) {
    super(status, message);
    this.name = 'DatabaseError';
  }
}

export default HttpException;
export { AuthenticationError, DatabaseError };
