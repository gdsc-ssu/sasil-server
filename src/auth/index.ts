import { Application } from 'express';
import passport from 'passport';

import { KakaoStrategy, GoogleStrategy, AppleStrategy } from '@/auth/strategy';
import User from '@/database/entity/user';
import { getUserDataById } from '@/database/controllers/user';

const configurePassport = (app: Application, isProdMode: boolean) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const userData = await getUserDataById(id);
      if (userData) {
        done(null, userData);
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      done(error);
    }
  });

  KakaoStrategy(isProdMode);
  GoogleStrategy(isProdMode);
  AppleStrategy(isProdMode);
};

export default configurePassport;
