/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import BasicEntity from './basic-entity';
import Experiment from './experiment';
import ExpComment from './exp-comment';
import ExpLike from './exp-like';
import Request from './request';
import ReqComment from './req-comment';
import Notification from './notification';
import ReqLike from './req-like';

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
  profile_img!: string;

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

  // User:ExpLike = 1:N
  @OneToMany(() => ExpLike, (expLike) => expLike.user)
  expLikes!: ExpLike[];

  // User:ReqLike = 1:N
  @OneToMany(() => ReqLike, (reqLike) => reqLike.user)
  reqLikes!: ReqLike[];

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
}

export default User;
