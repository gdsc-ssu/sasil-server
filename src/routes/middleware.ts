import { Request, Response, NextFunction } from 'express';

import { AuthenticationError } from '@/errors/customErrors';
import wrapAsync from '@/errors/util';
import { jwtVerify } from '@/auth/jwt';

/**
 * 로그인한 유저만 해당 API 요청에 대한 응답을 받을 수 있도록 만드는 미들웨어 (각 router에서는 req.userId로 controller를 불러와 원하는 결과를 전송)
 */
const checkLoggedIn = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token) {
      const userId = await jwtVerify(token);
      req.userId = userId;
      next();
    } else {
      throw new AuthenticationError(
        401,
        '요청의 Authorization Header에 JWT 토큰이 포함되어 있지 않습니다.',
      );
    }
  },
);

export default checkLoggedIn;