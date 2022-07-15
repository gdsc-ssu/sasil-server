/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import User from './user';
import Experiment from './experiment';

@Entity()
class ExpBookmark {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.expBookmarks)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.expBookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'exp_id',
  })
  experiment!: Experiment;
}

export default ExpBookmark;
