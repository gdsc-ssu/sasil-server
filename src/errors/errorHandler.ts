import { Request, Response, NextFunction } from 'express';

import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from './customErrors';

/**
 * 에러 종류에 따라 다른 상태값과 에러 메시지를 반환하는 에러 처리 함수(미들웨어)
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    next(err);
    return res.status(400).json({ msg: 'Invalid Request' });
  }

  if (err instanceof UnauthorizedError) {
    next(err);
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (err instanceof ForbiddenError) {
    next(err);
    return res.status(403).json({ msg: 'Request Rejected' });
  }

  if (err instanceof NotFoundError) {
    next(err);
    return res.status(404).json({ msg: 'Invalid URL' });
  }

  // 나머지는 Server Error
  next(err);
  return res.status(500).json({ msg: 'Server Error' });
};

/**
 * 요청이 들어왔는데 아무런 처리를 안하는 경우 404 Not Found Error 반환
 */
export const notFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({ msg: 'Invalid URL' });
};

export default errorHandler;
