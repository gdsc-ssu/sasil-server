import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt, VerifyCallback } from 'passport-jwt';

import { getUserByLoginInfo } from '@/database/controllers/user';
import { LoginTypes } from '@/database/entity/user';

dotenv.config();

export const makeJWTToken = (email: string, loginType: LoginTypes) => {
  const token = jwt.sign({ email, loginType }, process.env.JWT_SECRET!);

  return token;
};

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtVerify: VerifyCallback = async (jwtPayload, done) => {
  try {
    const userData = await getUserByLoginInfo(
      jwtPayload.email,
      jwtPayload.loginType,
    );

    // 유저 정보를 jwt토큰 데이터를 이용해서 받아왔다면 유저 데이터 전송
    if (userData) {
      return done(null, userData);
    }

    return done(null, false, { reason: '올바르지 않은 인증정보' });
  } catch (error) {
    return done(error);
  }
};

const jwtStrategy = new Strategy(jwtOpts, jwtVerify);

export default jwtStrategy;
