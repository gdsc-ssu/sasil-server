import express from 'express';

import { makeJWTToken } from '@/auth/jwt';
import verifyGoogle from '@/auth/social/google';

const router = express.Router();

router.post(`/login/:loginType`, async (req, res, next) => {
  try {
    let userData;
    if (req.params.loginType === 'google') {
      userData = await verifyGoogle(req.body.token);
    } else if (req.params.loginType === 'kakao') {
      // userData = await verifyKakao(req.body.token);
    }

    if (userData) {
      const token = makeJWTToken(userData.email, userData.login_type);
      return res.json({ token, userData });
    }

    return res.status(400).json({ message: '유저 확인 및 생성 오류' });
  } catch (error) {
    return next(error);
  }
});

export default router;
