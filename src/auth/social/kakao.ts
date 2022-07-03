import axios from 'axios';

import { UnauthorizedError } from '@/errors/customErrors';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

const kakaoVerifyURL = 'https://kapi.kakao.com/v2/user/me';

/**
 * 카카오 소셜 로그인 인증 후 회원가입 및 로그인 처리하는 함수
 *
 * @param token 프론트에서 카카오 로그인 후 받은 access_token
 * @returns 로그인/회원가입 처리 후 해당 유저 데이터 반환 (추후 jwt 토큰 생성)
 */
const verifyKakao = async (token: string) => {
  let resData;
  try {
    const response = await axios.get(kakaoVerifyURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    resData = response.data;
  } catch (error) {
    throw new UnauthorizedError(
      '프론트에서 카카오 로그인 후 전달받은 토큰이 유효하지 않습니다.',
    );
  }

  if (resData) {
    const { email } = resData.kakao_account;
    const name = resData.kakao_account.profile.nickname;
    const loginType = 'kakao';

    let userData = await getUserByLoginInfo(email, loginType);
    if (!userData) {
      userData = await addUser(email, name, loginType);
    }
    return userData;
  }

  return null;
};

export default verifyKakao;
