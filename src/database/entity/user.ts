/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';

import BasicEntity from './basic-entity';
import Experiment from './experiment';
import ExpComment from './exp-comment';
import ExpLike from './exp-like';
import ExpBookmark from './exp-bookmark';
import Request from './request';
import ReqComment from './req-comment';
import ReqLike from './req-like';
import ReqBookmark from './req-bookmark';
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

  // User:ExpBookmark = 1:N
  @OneToMany(() => ExpBookmark, (expBookmark) => expBookmark.user)
  expBookmarks!: ExpBookmark[];

  // User:ReqBookmark = 1:N
  @OneToMany(() => ReqBookmark, (reqBookmark) => reqBookmark.user)
  reqBookmarks!: ReqBookmark[];
}

export default User;
