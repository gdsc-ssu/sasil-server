import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

import { AuthenticationError } from '@/errors/customErrors';
import { PROD_SETTING } from '@/constants/index';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

interface UserAuthData {
  email: string;
  name: string;
}

type DeviceTypes = 'web' | 'mobile';

/**
 * server_id(client_id)로 client secret를 생성하여 반환하는 함수
 *
 * @param clientId web: server_id / mobile: 형식은 web과 동일하나 맨 뒤 요소는 앱 이름으로 대체
 * @returns client_secret
 */
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

/**
 * 프론트에서 애플 로그인 후 받은 인증 코드로 백엔드에서 재인증, 이후 받아온 idToken 반환하는 함수
 *
 * @param code 프론트에서 애플 로그인 후 받은 인증 코드
 * @param deviceType mobile과 web의 server id를 구분하기 위한 인자 ("apple-web" | "apple-mobile")
 * @returns 재인증을 통해 받은 idToken
 */
export const getAppleToken = async (code: string, deviceType: DeviceTypes) => {
  const clientId =
    deviceType === 'web'
      ? process.env.APPLE_CLIENT_ID_WEB!
      : process.env.APPLE_CLIENT_ID_MOBILE!;

  const response = await axios.post(
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

  const idToken = jwt.decode(response.data.id_token) as UserAuthData;
  return idToken;
};

/**
 * 애플 소셜 로그인 인증 후 회원가입 및 로그인 처리하는 함수
 *
 * @param token 프론트에서 애플 로그인 후 받은 authorization_code
 * @param deviceType mobile과 web의 server id를 구분하기 위한 인자 ("apple-web" | "apple-mobile")
 * @returns 로그인/회원가입 처리 후 해당 유저 데이터 반환 (추후 jwt 토큰 생성)
 */
const verifyApple = async (token: string, deviceType: DeviceTypes) => {
  let idToken;
  try {
    idToken = await getAppleToken(token, deviceType);
  } catch (error) {
    throw new AuthenticationError(
      403,
      '프론트에서 애플 로그인 후 전달받은 토큰이 유효하지 않습니다.',
    );
  }

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

  return null;
};

export default verifyApple;
