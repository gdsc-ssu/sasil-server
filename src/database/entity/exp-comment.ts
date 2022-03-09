/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, Column } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Experiment from './experiment';

@Entity()
class ExpComment extends BasicEntity {
  @Column('text')
  content!: string;

  @Column('int', { nullable: true })
  parentId!: number;

  @ManyToOne(() => User, (user) => user.expComment)
  user!: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.expComment)
  experiment!: Experiment;
}

export default ExpComment;
