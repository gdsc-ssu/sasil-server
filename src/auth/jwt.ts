import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { getUserByLoginInfo } from '@/database/controllers/user';
import { LoginTypes } from '@/database/entity/user';

dotenv.config();

interface DecodedType {
  email: string;
  loginType: LoginTypes;
  iat: number;
}

export const jwtVerify = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedType;
    const userData = await getUserByLoginInfo(decoded.email, decoded.loginType);

    // 유저 정보를 jwt토큰 데이터를 이용해서 받아왔다면 유저 데이터 전송
    if (!userData) {
      return null;
    }

    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const makeJWTToken = (email: string, loginType: LoginTypes) => {
  const token = jwt.sign({ email, loginType }, process.env.JWT_SECRET!);
  return token;
};
