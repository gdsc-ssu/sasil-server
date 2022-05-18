/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import BasicEntity from './basic-entity';
import Commission from './commission';
import Experiment from './experiment';

@Entity()
class Category extends BasicEntity {
  @Column('varchar', { length: 30 })
  name!: string;

  // Category:Comm = M:N -> comm_category
  @ManyToMany(() => Commission, (commission) => commission.categories)
  @JoinTable({
    name: 'comm_category',
    joinColumn: {
      name: 'category_id',
    },
    inverseJoinColumn: {
      name: 'comm_id',
    },
  })
  commissions!: Commission[];

  // Category:Exp = M:N -> exp_category
  @ManyToMany(() => Experiment, (experiment) => experiment.categories)
  @JoinTable({
    name: 'exp_category',
    joinColumn: {
      name: 'category_id',
    },
    inverseJoinColumn: {
      name: 'exp_id',
    },
  })
  experiments!: Experiment;
}

export default Category;
