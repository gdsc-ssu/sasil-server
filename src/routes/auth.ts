import express from 'express';

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

router.post(`/login/:loginType`, async (req, res, next) => {
  try {
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
          console.log('Login Type Error');
      }
    }

    // userData가 존재한다는 것은 소셜 인증 + 로그인(회원가입) 성공을 의미
    if (userData) {
      const token = makeJWTToken(userData.email, userData.login_type);
      return res.json({ token });
    }

    return res.status(400).json({ message: '유저 확인 및 생성 오류' });
  } catch (error) {
    return next(error);
  }
});

export default router;
