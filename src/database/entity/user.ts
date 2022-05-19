/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import BasicEntity from './basic-entity';
import Experiment from './experiment';
import Request from './request';
import ReqComment from './req-comment';
import ExpComment from './exp-comment';
import Notification from './notification';

export type LoginTypes = 'apple' | 'google' | 'kakao';

@Entity()
class User extends BasicEntity {
  @Column('varchar', { length: 255 })
  email!: string;

  @Column({ type: 'enum', enum: ['kakao', 'google', 'apple'] })
  login_type!: LoginTypes;

  @Column('varchar', { length: 30 })
  nickname!: string;

  @Column('varchar', { length: 255, nullable: true })
  profile!: string;

  // User:Exp = 1:N
  @OneToMany(() => Experiment, (experiment) => experiment.user)
  experiments!: Experiment[];

  // User:Request = 1:N
  @OneToMany(() => Request, (request) => request.user)
  requests!: Request[];

  // User:ReqComment = 1:N
  @OneToMany(() => ReqComment, (reqComment) => reqComment.user)
  reqComments!: ReqComment[];

  // User:ExpComment = 1:N
  @OneToMany(() => ExpComment, (expComment) => expComment.user)
  expComments!: ExpComment[];

  // User:Notification = 1:N -> sender_id
  @OneToMany(() => Notification, (notification) => notification.senderId)
  sendNotifications!: Notification[];

  // User:Notification = 1:N -> receiver_id
  @OneToMany(() => Notification, (notification) => notification.receiverId)
  receiveNotifications!: Notification[];

  // User:Exp = M:N -> exp_bookmark
  @ManyToMany(() => Experiment, (experiment) => experiment.userBookmarks)
  @JoinTable({
    name: 'exp_bookmark',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'exp_id',
    },
  })
  bookmarkExps!: Experiment[];

  // User:Exp = M:N -> exp_like
  @ManyToMany(() => Experiment, (experiment) => experiment.likes)
  @JoinTable({
    name: 'exp_like',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'exp_id',
    },
  })
  likeExps!: Experiment[];

  // User:Request = M:N -> req_bookmark
  @ManyToMany(() => Request, (request) => request.userBookmarks)
  @JoinTable({
    name: 'req_bookmark',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'req_id',
    },
  })
  bookmarkReqs!: Request[];

  // User:Request = M:N -> req_like
  @ManyToMany(() => Request, (request) => request.likes)
  @JoinTable({
    name: 'req_like',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'req_id',
    },
  })
  likeReqs!: Request[];
}

export default User;
