import express, { Request, Response, NextFunction } from 'express';

import { AuthenticationError } from '@/errors/customErrors';
import wrapAsync from '@/errors/util';
import { makeJWTToken } from '@/auth/jwt';
import verifyGoogle from '@/auth/social/google';
import verifyKakao from '@/auth/social/kakao';
import verifyApple from '@/auth/social/apple';

const LOGIN_TYPE = {
  google: 'google',
  kakao: 'kakao',
  appleWeb: 'apple-web',
  appleMobile: 'apple-mobile',
} as const;

const router = express.Router();

router.post(
  `/login/:loginType`,
  wrapAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authValue = req.headers.authorization;
    let userData;
    if (authValue) {
      switch (req.params.loginType) {
        case LOGIN_TYPE.google:
          userData = await verifyGoogle(authValue);
          break;
        case LOGIN_TYPE.kakao:
          userData = await verifyKakao(authValue);
          break;
        case LOGIN_TYPE.appleWeb:
          userData = await verifyApple(authValue, 'web');
          break;
        case LOGIN_TYPE.appleMobile:
          userData = await verifyApple(authValue, 'mobile');
          break;
        default:
          throw new AuthenticationError(
            404,
            '지원하지 않는 로그인 타입의 로그인 요청입니다.',
          );
      }
    } else {
      throw new AuthenticationError(
        403,
        '요청의 Authorization Header에 소셜로그인 인증 토큰(access_token)이 포함되어 있지 않습니다.',
      );
    }

    // userData가 존재한다는 것은 SNS 인증 + sasil 로그인(회원가입) 성공을 의미
    if (userData) {
      const token = makeJWTToken({ ...userData });
      return res.status(200).json({ token });
    }

    // 중간 과정에 문제가 없었는데도 userData에 값이 들어오지 않은 경우 에러 처리
    throw new Error('userData가 존재하지 않습니다.');
  }),
);

export default router;