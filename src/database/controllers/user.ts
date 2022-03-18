import { getRepository } from 'typeorm';

import UserEntity from '@/database/entity/user';

export const getUser = async (id: number) => {
  const userRepository = getRepository(UserEntity);
  const userInfo = await userRepository.findOne({ where: { id } });
  return userInfo;
};

export const addUser = async () => {}; // TODO: api 작업 시 추가
