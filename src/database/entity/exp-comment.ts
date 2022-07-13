/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Experiment from './experiment';

@Entity()
class ExpComment extends BasicEntity {
  @Column('text')
  content!: string;

  @Column('int', { name: 'parent_id', nullable: true })
  parentId!: number;

  // ExpComment:User = N:1
  @ManyToOne(() => User, (user) => user.expComments)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // ExpComment:Exp = N:1
  @ManyToOne(() => Experiment, (experiment) => experiment.expComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'exp_id',
  })
  experiment!: Experiment;
}

export default ExpComment;
