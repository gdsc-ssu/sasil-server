import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '@/database/entity/user';

dotenv.config();

export const jwtVerify = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    return decoded.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const makeJWTToken = (userData: User) => {
  const token = jwt.sign(userData, process.env.JWT_SECRET!);
  return token;
};
