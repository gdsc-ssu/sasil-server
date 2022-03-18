import passport from 'passport';
import { OAuth2Strategy as GoogleLoginStrategy } from 'passport-google-oauth';
import { Strategy as KakaoLoginStrategy } from 'passport-kakao';
import AppleLoginStrategy from 'passport-apple';
import dotenv from 'dotenv';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';
import {
  getUserDataByEmailAndType,
  addUser,
} from '@/database/controllers/user';

dotenv.config();

export const KakaoStrategy = (isProdMode: boolean) => {
  passport.use(
    new KakaoLoginStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID!,
        clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        callbackURL: isProdMode
          ? PROD_SETTING.redirectURIKakao
          : DEV_SETTING.redirectURIKakao,
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const loginType = 'kakao';

        let userData = getUserDataByEmailAndType(email, loginType);
        if (!userData) {
          userData = addUser(email, loginType);
        }

        done(null, userData);
      },
    ),
  );
};

export const GoogleStrategy = (isProdMode: boolean) => {
  passport.use(
    new GoogleLoginStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: isProdMode
          ? PROD_SETTING.redirectURIGoogle
          : DEV_SETTING.redirectURIGoogle,
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const loginType = 'google';

        let userData = getUserDataByEmailAndType(email, loginType);
        if (!userData) {
          userData = addUser(email, loginType);
        }

        done(null, userData);
      },
    ),
  );
};

// TODO: 애플 로그인은 서버 배포 후 진행 예정
export const AppleStrategy = (isProdMode: boolean) => {
  passport.use(
    new AppleLoginStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID!,
        teamID: process.env.APPLE_TEAM_ID!,
        keyID: process.env.APPLE_KEY_ID!,
        callbackURL: isProdMode
          ? PROD_SETTING.redirectURIApple
          : DEV_SETTING.redirectURIApple,
        privateKeyLocation: '', // or privateKeyString
      },
      (req, accessToken, refreshToken, decodedIdToken, profile) => {
        console.log('apple login');
        // TODO: 추가 필요
      },
    ),
  );
};
