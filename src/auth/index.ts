import { Application } from 'express';
import passport from 'passport';

import { KakaoStrategy, GoogleStrategy, AppleStrategy } from '@/auth/strategy';
import jwtStrategy from './jwt';

const configurePassport = (app: Application, isProdMode: boolean) => {
  app.use(passport.initialize());

  jwtStrategy();

  KakaoStrategy(isProdMode);
  GoogleStrategy(isProdMode);
  AppleStrategy(isProdMode);
};

export default configurePassport;
