import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
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
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload() as UserAuthData;

    if (payload) {
      const { email, name } = payload;
      const loginType = 'google';

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

export default verifyGoogle;
