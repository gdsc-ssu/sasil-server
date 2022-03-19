import express from 'express';
import passport from 'passport';

import { checkLoggedin, checkLoggedout } from '@/routes/middlewares';

const router = express.Router();

// TODO: 로그인 성공 후, 넘겨줄 데이터를 어떻게 처리할지!

router.get(
  '/google',
  checkLoggedout,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);
router.get('/kakao', checkLoggedout, passport.authenticate('kakao'));
router.get('/apple', checkLoggedout, passport.authenticate('apple'));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
    successRedirect: 'http://localhost:3000',
  }),
);

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: 'http://localhost:3000/login',
    successRedirect: 'http://localhost:3000',
  }),
);

router.get(
  '/apple/callback',
  passport.authenticate('apple', {
    failureRedirect: 'http://localhost:3000/login',
    successRedirect: 'http://localhost:3000',
  }),
);

export default router;
