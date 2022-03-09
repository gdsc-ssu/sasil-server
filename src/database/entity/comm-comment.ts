/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, Column } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Commission from './commission';

@Entity()
class CommComment extends BasicEntity {
  @Column('text')
  content!: string;

  @Column('int', { nullable: true })
  parentId!: number;

  @ManyToOne(() => User, (user) => user.commComment)
  user!: User;

  @ManyToOne(() => Commission, (commission) => commission.commComment)
  commission!: Commission;
}

export default CommComment;
