import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '@/errors/customErrors';
import wrapAsync from '@/utils/wrapAsync';
import { jwtVerify } from '@/auth/jwt';

/**
 * 로그인한 유저만 해당 API 요청에 대한 응답을 받을 수 있도록 만드는 미들웨어 (각 router에서는 req.userId로 controller를 불러와 원하는 결과를 전송)
 */
export const checkLoggedIn = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token) {
      const userId = await jwtVerify(token);
      req.userId = userId;
      next();
    } else {
      throw new UnauthorizedError(
        '요청의 Authorization Header에 JWT 토큰이 포함되어 있지 않습니다.',
      );
    }
  },
);

// TODO: token이 유효하지 않은 경우 에러처리를 할지, undefined를 반환할지
export const getUserId = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token) {
      const userId = await jwtVerify(token);
      req.userId = userId;
    }

    next();
  },
);
