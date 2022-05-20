/* eslint-disable import/no-cycle */

import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import User from './user';
import Request from './request';

@Entity()
class ReqLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reqLikes)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Request, (request) => request.reqLikes)
  @JoinColumn({
    name: 'exp_id',
  })
  request!: Request;
}

export default ReqLike;
