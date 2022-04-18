import axios from 'axios';

import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

const kakaoVerifyURL = 'https://kapi.kakao.com/v2/user/me';

/**
 * 카카오 소셜 로그인 인증 후 회원가입 및 로그인 처리하는 함수
 *
 * @param token 프론트에서 카카오 로그인 후 받은 access_token
 * @returns 로그인/회원가입 처리 후 해당 유저 데이터 반환 (추후 jwt 토큰 생성)
 */
const verifyKakao = async (token: string) => {
  try {
    const response = await axios.get(kakaoVerifyURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response) {
      const resData = response.data;
      const { email } = resData.kakao_account;
      const name = resData.kakao_account.profile.nickname;
      const loginType = 'kakao';

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

export default verifyKakao;
