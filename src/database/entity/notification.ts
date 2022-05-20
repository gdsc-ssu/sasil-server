/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';

@Entity()
class Notification extends BasicEntity {
  @Column({ type: 'enum', enum: ['exp', 'req', 'req-exp', 'recomment'] })
  noti_type!: string;

  @Column('int', { nullable: true })
  postId!: string;

  @Column({ type: 'enum', enum: ['exp', 'req'] })
  post_type!: string;

  // Notification:User = N:1 -> sender_id
  @ManyToOne(() => User, (user) => user.sendNotifications)
  @JoinColumn({
    name: 'sender_id',
  })
  senderId!: User;

  // Notification:User = N:1 -> receiver_id
  @ManyToOne(() => User, (user) => user.receiveNotifications)
  @JoinColumn({
    name: 'receiver_id',
  })
  receiverId!: User;
}

export default Notification;
