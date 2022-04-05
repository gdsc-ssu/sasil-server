import axios from 'axios';

import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

const kakaoVerifyURL = 'https://kapi.kakao.com/v2/user/me';

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
