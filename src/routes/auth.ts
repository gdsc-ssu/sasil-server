import express from 'express';

import { makeJWTToken } from '@/auth/jwt';
import verifyGoogle from '@/auth/social/google';
import verifyKakao from '@/auth/social/kakao';
import verifyApple from '@/auth/social/apple';

const router = express.Router();

router.post(`/login/:loginType`, async (req, res, next) => {
  try {
    const authValue = req.headers.authorization;
    let userData;
    if (authValue) {
      if (req.params.loginType === 'google') {
        userData = await verifyGoogle(authValue);
      } else if (req.params.loginType === 'kakao') {
        userData = await verifyKakao(authValue);
      } else if (req.params.loginType === 'apple') {
        userData = await verifyApple(authValue);
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
