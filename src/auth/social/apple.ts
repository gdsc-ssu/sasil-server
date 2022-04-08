import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

import { PROD_SETTING } from '@/constants/index';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

interface UserAuthData {
  email: string;
  name: string;
}

const createSignWithAppleSecret = () => {
  const token = jwt.sign({}, process.env.APPLE_SECRET_KEY!, {
    algorithm: 'ES256',
    expiresIn: '10h',
    audience: 'https://appleid.apple.com',
    issuer: process.env.APPLE_TEAM_ID!,
    subject: process.env.APPLE_CLIENT_ID!,
    keyid: process.env.APPLE_KEY_ID!,
  });

  return token;
};

export const getAppleToken = async (code: string) =>
  axios.post(
    'https://appleid.apple.com/auth/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      client_secret: createSignWithAppleSecret(),
      client_id: process.env.APPLE_CLIENT_ID,
      redirect_uri: PROD_SETTING.redirectURI.apple,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

const verifyApple = async (token: string) => {
  try {
    const response = await getAppleToken(token);
    const idToken = jwt.decode(response.data.id_token) as UserAuthData;

    if (idToken) {
      const { email } = idToken;
      const name = idToken.name ?? 'test'; // TODO: 첫 로그인 시에만 제공?
      const loginType = 'apple';

      let userData = await getUserByLoginInfo(email, loginType);
      if (!userData) {
        userData = await addUser(email, name, loginType);
      }
      return userData;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default verifyApple;
