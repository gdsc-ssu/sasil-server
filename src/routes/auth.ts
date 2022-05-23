import express, { Request, Response, NextFunction } from 'express';

import {
  BadRequestError,
  UnauthorizedError,
  ServerError,
} from '@/errors/customErrors';
import wrapAsync from '@/utils/wrapAsync';
import { makeJWTToken } from '@/auth/jwt';
import verifyGoogle from '@/auth/social/google';
import verifyKakao from '@/auth/social/kakao';
import verifyApple from '@/auth/social/apple';

const LOGIN_TYPE = {
  googleWeb: 'google-web',
  googleMobile: 'google-mobile',
  appleWeb: 'apple-web',
  appleMobile: 'apple-mobile',
  kakao: 'kakao',
} as const;

const router = express.Router();

router.post(
  `/login/:loginType`,
  wrapAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authValue = req.headers.authorization;
    let userData;
    if (authValue) {
      switch (req.params.loginType) {
        case LOGIN_TYPE.googleWeb:
          userData = await verifyGoogle(authValue, 'web');
          break;
        case LOGIN_TYPE.googleMobile:
          userData = await verifyGoogle(authValue, 'mobile');
          break;
        case LOGIN_TYPE.appleWeb:
          userData = await verifyApple(authValue, 'web');
          break;
        case LOGIN_TYPE.appleMobile:
          userData = await verifyApple(authValue, 'mobile');
          break;
        case LOGIN_TYPE.kakao:
          userData = await verifyKakao(authValue);
          break;
        default:
          throw new BadRequestError(
            '지원하지 않는 로그인 타입의 로그인 요청입니다.',
          );
      }
    } else {
      throw new UnauthorizedError(
        '요청의 Authorization Header에 소셜로그인 인증 토큰이 포함되어 있지 않습니다.',
      );
    }

    // userData가 존재한다는 것은 SNS 인증 + sasil 로그인(회원가입) 성공을 의미
    if (userData) {
      const token = makeJWTToken({ ...userData });
      return res.status(200).json({ token });
    }

    // 중간 과정에 문제가 없었는데도 userData에 값이 들어오지 않은 경우 에러 처리
    throw new ServerError('자동 회원가입 처리가 정상적으로 동작하지 않습니다.');
  }),
);

export default router;
