/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Experiment from './experiment';

@Entity()
class ExpComment extends BasicEntity {
  @Column('text')
  content!: string;

  @Column('int', { nullable: true })
  parent_id!: number;

  // ExpComment:User = N:1
  @ManyToOne(() => User, (user) => user.expComments)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // ExpComment:Exp = N:1
  @ManyToOne(() => Experiment, (experiment) => experiment.expComments)
  @JoinColumn({
    name: 'exp_id',
  })
  experiment!: Experiment;
}

export default ExpComment;
