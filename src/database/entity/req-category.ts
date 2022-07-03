/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import Cateogry from './category';
import Request from './request';

@Entity()
class ReqCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cateogry, (category) => category.reqCategories)
  @JoinColumn({
    name: 'category_id',
  })
  category!: Cateogry;

  @ManyToOne(() => Request, (request) => request.reqCategories)
  @JoinColumn({
    name: 'req_id',
  })
  request!: Request;
}

export default ReqCategory;
