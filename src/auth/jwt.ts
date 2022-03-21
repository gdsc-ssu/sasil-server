import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { getUserByLoginInfo } from '@/database/controllers/user';

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = () => {
  passport.use(
    new Strategy(jwtOpts, async (jwtPayload, done) => {
      console.log(jwtPayload);
      const userData = await getUserByLoginInfo(
        jwtPayload.email,
        jwtPayload.loginType,
      );
      return done(null, userData);
    }),
  );
};

export default jwtStrategy;
