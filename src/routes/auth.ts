import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import checkLoggedin from '@/routes/middlewares';
import { DEV_SETTING, PROD_SETTING } from '@/constants/index';

dotenv.config();
const router = express.Router();

const clientURL =
  process.env.NODE_ENV === 'production'
    ? PROD_SETTING.clientURL
    : DEV_SETTING.clientURL;

const loginResponse = (req: any, res: any, err: any, user: any) => {
  if (err) {
    return res.status(400);
  }
  if (!user) {
    return res.status(200).json({
      success: false,
    });
  }
  req.login(user, { session: false }, (error: any) => {
    if (error) {
      res.send(error);
    }
    const token = jwt.sign(
      { email: user.email, loginType: user.loginType },
      process.env.JWT_SECRET!,
    );
    // TODO: userToken을 어떻게 유저한테 넘겨줄건지, redirect
    return res.status(200).json({ userToken: token, success: true });
  });
};

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);
router.get('/kakao', passport.authenticate('kakao', { session: false }));
router.get('/apple', passport.authenticate('apple', { session: false }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    loginResponse(req, res, err, user);
  })(req, res, next);
});

router.get('/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', (err, user) => {
    loginResponse(req, res, err, user);
  })(req, res, next);
});

router.get('/apple/callback', (req, res, next) => {
  passport.authenticate('apple', (err, user) => {
    loginResponse(req, res, err, user);
  })(req, res, next);
});

export default router;
