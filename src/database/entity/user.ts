/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Experiment from './experiment';
import Commission from './commission';
import CommComment from './comm-comment';
import ExpComment from './exp-comment';
import Notification from './notification';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column({ type: 'enum', enum: ['kakao', 'google', 'apple'] })
  login_type!: string;

  @Column('varchar', { length: 30 })
  nickname!: string;

  @Column('varchar', { length: 255 })
  profile!: string;

  @OneToMany(() => Experiment, (experiment) => experiment.user)
  experiment!: Experiment;

  @ManyToMany(() => Experiment, (experiment) => experiment.user)
  @JoinTable({ name: 'expBookmark' })
  expBookmark!: Experiment;

  @ManyToMany(() => Experiment, (experiment) => experiment.user)
  @JoinTable({ name: 'expLike' })
  expLike!: Experiment;

  @OneToMany(() => Commission, (commission) => commission.user)
  commission!: Commission;

  @ManyToMany(() => Commission, (commission) => commission.user)
  @JoinTable({ name: 'commBookmark' })
  commBookmark!: Commission;

  @ManyToMany(() => Commission, (commission) => commission.user)
  @JoinTable({ name: 'commLike' })
  commLike!: Commission;

  @OneToMany(() => CommComment, (commComment) => commComment.user)
  commComment!: CommComment;

  @OneToMany(() => ExpComment, (expComment) => expComment.user)
  expComment!: ExpComment;

  @OneToMany(() => Notification, (notification) => notification.senderId)
  senderId!: Notification;

  @OneToMany(() => Notification, (notification) => notification.receiverId)
  receiverId!: Notification;
}

export default User;
