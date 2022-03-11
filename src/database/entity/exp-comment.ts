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

  @ManyToOne(() => User, (user) => user.expComment)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.expComment)
  @JoinColumn({
    name: 'exp_id',
  })
  experiment!: Experiment;
}

export default ExpComment;
