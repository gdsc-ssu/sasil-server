import { getRepository } from 'typeorm';

import UserEntity, { LoginTypes } from '@/database/entity/user';

export const getUserById = async (id: number) => {
  const userData = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .where('user.id = :id', { id })
    .getOne();

  return userData;
};

export const getUserByLoginInfo = async (
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

export const addUser = async (
  email: string,
  name: string,
  loginType: LoginTypes,
) => {
  const userRepository = getRepository(UserEntity);

  const newUserData = userRepository.create({
    email,
    login_type: loginType,
    nickname: name, // TODO: random 생성
    profile: 'test', // TODO: random 생성
  });

  await userRepository.save(newUserData);

  return newUserData;
};
