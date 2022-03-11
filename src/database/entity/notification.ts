/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';

@Entity()
class Notification extends BasicEntity {
  @Column({ type: 'enum', enum: ['exp', 'comm', 'comm-exp', 'recomment'] })
  noti_type!: string;

  @Column('int', { nullable: true })
  postId!: string;

  @Column({ type: 'enum', enum: ['exp', 'comm'] })
  post_type!: string;

  @ManyToOne(() => User, (user) => user.senderId)
  @JoinColumn({
    name: 'sender_id',
  })
  senderId!: User;

  @ManyToOne(() => User, (user) => user.receiverId)
  @JoinColumn({
    name: 'receiver_id',
  })
  receiverId!: User;
}

export default Notification;
