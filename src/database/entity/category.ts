/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';

import BasicEntity from './basic-entity';
import ReqCategory from './req-category';
import ExpCategory from './exp-category';

@Entity()
class Category extends BasicEntity {
  @Column('varchar', { length: 30 })
  name!: string;

  // Category:ReqCategory = 1:N
  @OneToMany(() => ReqCategory, (reqCategory) => reqCategory.category)
  reqCategories!: ReqCategory[];

  // Category:ExpCategory = 1:N
  @OneToMany(() => ExpCategory, (expCategory) => expCategory.category)
  expCategories!: ExpCategory[];
}

export default Category;
