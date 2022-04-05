import express from 'express';

import { makeJWTToken } from '@/auth/jwt';
import verifyGoogle from '@/auth/social/google';
import verifyKakao from '@/auth/social/kakao';
import verifyApple from '@/auth/social/apple';

const router = express.Router();

router.post(`/login/:loginType`, async (req, res, next) => {
  try {
    let userData;
    if (req.params.loginType === 'google') {
      userData = await verifyGoogle(req.body.token);
    } else if (req.params.loginType === 'kakao') {
      userData = await verifyKakao(req.body.token);
    } else if (req.params.loginType === 'apple') {
      userData = await verifyApple(req.body.token);
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
