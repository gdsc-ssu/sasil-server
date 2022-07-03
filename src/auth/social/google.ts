import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

import { UnauthorizedError } from '@/errors/customErrors';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

interface UserAuthData {
  email: string;
  name: string;
}

type DeviceTypes = 'web' | 'mobile';

/**
 * 구글 소셜 로그인 인증 후 회원가입 및 로그인 처리하는 함수
 *
 * @param token 프론트에서 구글 로그인 후 받은 idToken
 * @param deviceType mobile과 web 구분을 위한 인자
 * @returns 로그인/회원가입 처리 후 해당 유저 데이터 반환 (추후 jwt 토큰 생성)
 */
const verifyGoogle = async (token: string, deviceType: DeviceTypes) => {
  let payload;
  const clientId =
    deviceType === 'web'
      ? process.env.GOOGLE_CLIENT_ID_WEB!
      : process.env.GOOGLE_CLIENT_ID_MOBILE!;

  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    payload = ticket.getPayload() as UserAuthData;
  } catch (error) {
    throw new UnauthorizedError(
      '프론트에서 구글 로그인 후 전달받은 토큰이 유효하지 않습니다.',
    );
  }

  if (payload) {
    const { email, name } = payload;
    const loginType = 'google';

    let userData = await getUserByLoginInfo(email, loginType);
    if (!userData) {
      userData = await addUser(email, name, loginType);
    }
    return userData;
  }

  return null;
};

export default verifyGoogle;
