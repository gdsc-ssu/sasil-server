/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Commission from './commission';

@Entity()
class CommComment extends BasicEntity {
  @Column('text')
  content!: string;

  @Column('int', { nullable: true })
  parent_id!: number;

  // CommComment:User = N:1
  @ManyToOne(() => User, (user) => user.commComments)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // CommComment:Comm = N:1
  @ManyToOne(() => Commission, (commission) => commission.commComments)
  @JoinColumn({
    name: 'comm_id',
  })
  commission!: Commission;
}

export default CommComment;
