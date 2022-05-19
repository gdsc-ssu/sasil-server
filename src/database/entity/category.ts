/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import BasicEntity from './basic-entity';
import Request from './request';
import Experiment from './experiment';

@Entity()
class Category extends BasicEntity {
  @Column('varchar', { length: 30 })
  name!: string;

  // Category:Request = M:N -> req_category
  @ManyToMany(() => Request, (request) => request.categories)
  @JoinTable({
    name: 'req_category',
    joinColumn: {
      name: 'category_id',
    },
    inverseJoinColumn: {
      name: 'req_id',
    },
  })
  requests!: Request[];

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
