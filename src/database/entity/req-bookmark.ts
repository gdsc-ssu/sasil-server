/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import User from './user';
import Request from './request';

@Entity()
class ReqBookmark {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reqBookmarks)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Request, (request) => request.reqBookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'req_id',
  })
  request!: Request;
}

export default ReqBookmark;
