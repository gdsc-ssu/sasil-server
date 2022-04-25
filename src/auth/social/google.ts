import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

import { AuthenticationError } from '@/errors/customErrors';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

interface UserAuthData {
  email: string;
  name: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 구글 소셜 로그인 인증 후 회원가입 및 로그인 처리하는 함수
 *
 * @param token 프론트에서 구글 로그인 후 받은 idToken
 * @returns 로그인/회원가입 처리 후 해당 유저 데이터 반환 (추후 jwt 토큰 생성)
 */
const verifyGoogle = async (token: string) => {
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload() as UserAuthData;
  } catch (error) {
    console.log(error); // TODO: 원래 에러는 어떻게 처리할지 정하기
    throw new AuthenticationError(
      403,
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
