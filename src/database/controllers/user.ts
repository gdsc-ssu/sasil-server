import { getRepository } from 'typeorm';

import UserEntity from '@/database/entity/user';

type LoginTypes = 'kakao' | 'google' | 'apple';

export const getUserDataById = async (id: number) => {
  const userData = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .where('user.id = :id', { id })
    .getOne();

  return userData;
};

export const getUserDataByEmailAndType = async (
  email: string,
  loginType: LoginTypes,
) => {
  const userData = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .where('user.email = :email', { email })
    .andWhere('user.login_type = :loginType', { loginType })
    .getOne();

  return userData;
};

export const addUser = async (email: string, loginType: LoginTypes) => {
  const userRepository = getRepository(UserEntity);

  const newUserData = userRepository.create({
    email,
    login_type: loginType,
    nickname: 'test', // TODO: random 생성
    profile: 'test', // TODO: random 생성
  });

  await userRepository.save(newUserData);

  return newUserData;
};
