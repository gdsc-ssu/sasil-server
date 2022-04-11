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

type DeviceTypes = 'web' | 'mobile';

const createSignWithAppleSecret = (clientId: string) => {
  const token = jwt.sign({}, process.env.APPLE_SECRET_KEY!, {
    algorithm: 'ES256',
    expiresIn: '10h',
    audience: 'https://appleid.apple.com',
    issuer: process.env.APPLE_TEAM_ID!,
    subject: clientId,
    keyid: process.env.APPLE_KEY_ID!,
  });

  return token;
};

export const getAppleToken = async (code: string, deviceType: DeviceTypes) => {
  const clientId =
    deviceType === 'web'
      ? process.env.APPLE_CLIENT_ID_WEB!
      : process.env.APPLE_CLIENT_ID_MOBILE!;

  return axios.post(
    'https://appleid.apple.com/auth/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      client_secret: createSignWithAppleSecret(clientId),
      client_id: clientId,
      redirect_uri: PROD_SETTING.redirectURI.apple,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
};

const verifyApple = async (token: string, deviceType: DeviceTypes) => {
  try {
    const response = await getAppleToken(token, deviceType);
    const idToken = jwt.decode(response.data.id_token) as UserAuthData;

    if (idToken) {
      const { email } = idToken;
      const name = 'test'; // TODO: 프론트의 idToken을 받아와야 이름 받아올 수 있음
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
