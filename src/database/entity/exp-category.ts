/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import Cateogry from './category';
import Experiment from './experiment';

@Entity()
class ExpCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cateogry, (category) => category.expCategories)
  @JoinColumn({
    name: 'category_id',
  })
  category!: Cateogry;

  @ManyToOne(() => Experiment, (experiment) => experiment.expCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'exp_id',
  })
  experiment!: Experiment;
}

export default ExpCategory;
