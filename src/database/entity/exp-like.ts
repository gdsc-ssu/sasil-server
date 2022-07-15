/* eslint-disable import/no-cycle */

import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import User from './user';
import Experiment from './experiment';

@Entity()
class ExpLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.expLikes)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.expLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'exp_id',
  })
  experiment!: Experiment;
}

export default ExpLike;
