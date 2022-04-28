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

/**
 * 인증 관련 오류 생성자
 *
 * @param status 상태 코드
 * @param message 에러 메시지
 */
class AuthenticationError extends HttpException {
  constructor(status: number, message: string) {
    super(status, message);
    this.name = 'AuthenticationError';
  }
}

/**
 * 데이터베이스 관련 오류 생성자 (오류 코드 503으로 고정)
 *
 * @param message 에러 메시지
 */
class DatabaseError extends HttpException {
  constructor(message: string) {
    super(503, message);
    this.name = 'DatabaseError';
  }
}

export default HttpException;
export { AuthenticationError, DatabaseError };
