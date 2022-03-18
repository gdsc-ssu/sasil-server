import { getRepository } from 'typeorm';

import UserEntity from '@/database/entity/user';

const userRepository = getRepository(UserEntity);

export const getUser = async (id: number) => {
  const userInfo = await userRepository.findOne({ where: { id } });
  return userInfo;
};

export const addUser = async () => {}; // TODO: api 작업 시 추가
