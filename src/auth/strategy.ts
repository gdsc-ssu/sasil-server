/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import { OAuth2Strategy as GoogleLoginStrategy } from 'passport-google-oauth';
import { Strategy as KakaoLoginStrategy } from 'passport-kakao';
import AppleLoginStrategy from 'passport-apple';
import dotenv from 'dotenv';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

export const KakaoStrategy = (isProdMode: boolean) => {
  passport.use(
    new KakaoLoginStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID!,
        clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        callbackURL: isProdMode
          ? PROD_SETTING.redirectURI.kakao
          : DEV_SETTING.redirectURI.kakao,
      },
      async (accessToken, refreshToken, profile, done) => {
        const { email } = profile._json.kakao_account;
        const name = profile.displayName;
        const loginType = 'kakao';

        // email, loginType으로 유저 찾고, 없으면 생성
        let userData = await getUserByLoginInfo(email, loginType);
        if (!userData) {
          userData = await addUser(email, name, loginType);
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
          ? PROD_SETTING.redirectURI.google
          : DEV_SETTING.redirectURI.google,
      },
      async (accessToken, refreshToken, profile, done) => {
        const { email } = profile._json;
        const loginType = 'google';
        const name = profile.displayName;

        let userData = await getUserByLoginInfo(email, loginType);
        if (!userData) {
          userData = await addUser(email, name, loginType);
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
          ? PROD_SETTING.redirectURI.apple
          : DEV_SETTING.redirectURI.apple,
        privateKeyLocation: '', // or privateKeyString
      },
      (req, accessToken, refreshToken, decodedIdToken, profile) => {
        console.log('apple login');
        // TODO: 추가 필요
      },
    ),
  );
};
