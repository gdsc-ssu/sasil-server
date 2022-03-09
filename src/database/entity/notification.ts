/* eslint-disable import/no-cycle */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './user';

@Entity()
class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ['exp', 'comm', 'comm-exp', 'recomment'] })
  noti_type!: string;

  @Column('int', { nullable: true })
  postId!: string;

  @Column({ type: 'enum', enum: ['exp', 'comm'] })
  post_type!: string;

  @ManyToOne(() => User, (user) => user.senderId)
  senderId!: User;

  @ManyToOne(() => User, (user) => user.receiverId)
  receiverId!: User;
}

export default Notification;
