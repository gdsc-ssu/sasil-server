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

  @Column('varchar', { length: 255 })
  profile!: string;

  @OneToMany(() => Experiment, (experiment) => experiment.user)
  experiment!: Experiment;

  @OneToMany(() => Commission, (commission) => commission.user)
  commission!: Commission;

  @OneToMany(() => CommComment, (commComment) => commComment.user)
  commComment!: CommComment;

  @OneToMany(() => ExpComment, (expComment) => expComment.user)
  expComment!: ExpComment;

  @OneToMany(() => Notification, (notification) => notification.senderId)
  senderId!: Notification;

  @OneToMany(() => Notification, (notification) => notification.receiverId)
  receiverId!: Notification;

  @ManyToMany(() => Experiment, (experiment) => experiment.user)
  @JoinTable({
    name: 'exp_bookmark',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'exp_id',
    },
  })
  expBookmark!: Experiment;

  @ManyToMany(() => Experiment, (experiment) => experiment.user)
  @JoinTable({
    name: 'exp_like',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'exp_id',
    },
  })
  expLike!: Experiment;

  @ManyToMany(() => Commission, (commission) => commission.user)
  @JoinTable({
    name: 'comm_bookmark',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'comm_id',
    },
  })
  commBookmark!: Commission;

  @ManyToMany(() => Commission, (commission) => commission.user)
  @JoinTable({
    name: 'comm_like',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'comm_id',
    },
  })
  commLike!: Commission;
}

export default User;
