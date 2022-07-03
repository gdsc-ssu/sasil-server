/* eslint-disable max-classes-per-file */

/**
 * 400 Bad Request Error (요청 실패)
 * @param message 서버에서 확인하는 에러 발생 사유
 */
class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'BadRequestError';
  }
}

/**
 * 401 Unauthorized Error (인증 실패)
 * @param message 서버에서 확인하는 에러 발생 사유
 */
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden Error (권한 없음)
 * @param message 서버에서 확인하는 에러 발생 사유
 */
class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found Error
 * @param message 서버에서 확인하는 에러 발생 사유
 */
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'NotFoundError';
  }
}

/**
 * 500 Server Error
 * @param message 서버에서 확인하는 에러 발생 사유
 */
class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'ServerError';
  }
}

export {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
};
