/* eslint-disable import/no-cycle */
import {
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Request from './request';

@Entity()
class ReqComment extends BasicEntity {
  @Column('text')
  content!: string;

  @Column('int', { name: 'parent_id', nullable: true })
  parentId!: number;

  // ReqComment:User = N:1
  @ManyToOne(() => User, (user) => user.reqComments)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // ReqComment:Request = N:1
  @ManyToOne(() => Request, (request) => request.reqComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'req_id',
  })
  request!: Request;

  // 삭제된 날짜 (기본: Null)
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedDate!: Date;
}

export default ReqComment;
