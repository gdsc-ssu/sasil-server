/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, DeleteDateColumn } from 'typeorm';

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
  @Column('varchar', { length: 255, select: false })
  email!: string;

  @Column('enum', {
    name: 'login_type',
    enum: ['kakao', 'google', 'apple'],
    select: false,
  })
  loginType!: LoginTypes;

  @Column('varchar', { length: 30 })
  nickname!: string;

  @Column('varchar', { name: 'profile_img', length: 255, nullable: true })
  profileImg!: string;

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

  // 삭제된 날짜 (기본: Null)
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedDate!: Date;
}

export default User;
