import express from 'express';
import passport from 'passport';

import { checkLoggedin, checkLoggedout } from '@/routes/middlewares';
import { DEV_SETTING, PROD_SETTING } from '@/constants/index';

const router = express.Router();

const clientURL =
  process.env.NODE_ENV === 'production'
    ? PROD_SETTING.clientURL
    : DEV_SETTING.clientURL;

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
    failureRedirect: `${clientURL}/login`,
    successRedirect: clientURL,
  }),
);

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: `${clientURL}/login`,
    successRedirect: clientURL,
  }),
);

router.get(
  '/apple/callback',
  passport.authenticate('apple', {
    failureRedirect: `${clientURL}/login`,
    successRedirect: clientURL,
  }),
);

export default router;
