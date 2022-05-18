/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import BasicEntity from './basic-entity';
import Experiment from './experiment';
import Commission from './commission';
import CommComment from './comm-comment';
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

  // User:Comm = 1:N
  @OneToMany(() => Commission, (commission) => commission.user)
  commissions!: Commission[];

  // User:CommComment = 1:N
  @OneToMany(() => CommComment, (commComment) => commComment.user)
  commComments!: CommComment[];

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

  // User:Comm = M:N -> comm_bookmark
  @ManyToMany(() => Commission, (commission) => commission.userBookmarks)
  @JoinTable({
    name: 'comm_bookmark',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'comm_id',
    },
  })
  bookmarkComms!: Commission[];

  // User:Comm = M:N -> comm_like
  @ManyToMany(() => Commission, (commission) => commission.likes)
  @JoinTable({
    name: 'comm_like',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'comm_id',
    },
  })
  likeComms!: Commission[];
}

export default User;
