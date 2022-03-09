/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import BasicEntity from './basic-entity';
import Commission from './commission';
import Experiment from './experiment';

@Entity()
class Category extends BasicEntity {
  @Column('varchar', { length: 30 })
  name!: string;

  @ManyToMany(() => Commission, (commission) => commission.commCategory)
  @JoinTable({ name: 'comm_category' })
  commCategory!: string;

  @ManyToMany(() => Experiment, (experiment) => experiment.expCategory)
  @JoinTable({ name: 'exp_category' })
  expCategory!: string;
}

export default Category;
