import { Request, Response, NextFunction } from 'express';

/**
 * 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달
 */
const wrapAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

export default wrapAsync;
