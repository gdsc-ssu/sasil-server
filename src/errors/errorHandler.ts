import { Request, Response, NextFunction } from 'express';

import HttpException, {
  AuthenticationError,
  DatabaseError,
} from './customErrors';

/**
 * 에러 종류에 따라 다른 상태값과 에러 메시지를 반환하는 에러 처리 함수(미들웨어)
 */
const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AuthenticationError) {
    console.log(err);
    return res.status(err.status).json({ msg: '인증 관련 오류' });
  }

  if (err instanceof DatabaseError) {
    console.log(err);
    return res.status(err.status).json({ msg: '데이터베이스 관련 오류' }); // 503 고정
  }

  console.log(err);
  return res.status(500).json({ msg: '서버 오류' });
};

/**
 * 존재하지 않는 URL에 대한 요청에 대해서 404 에러 반환하는 함수(미들웨어)
 */
export const noExistReqErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({ msg: '존재하지 않는 URL에 대한 요청 오류' });
};

export default errorHandler;
