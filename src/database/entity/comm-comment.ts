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

  @ManyToOne(() => User, (user) => user.commComment)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Commission, (commission) => commission.commComment)
  @JoinColumn({
    name: 'comm_id',
  })
  commission!: Commission;
}

export default CommComment;
