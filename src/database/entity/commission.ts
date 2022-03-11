/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Experiment from './experiment';
import CommComment from './comm-comment';
import Category from './category';

@Entity()
class Commission extends BasicEntity {
  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 255, nullable: true })
  thumbnail!: string;

  @OneToMany(() => Experiment, (experiment) => experiment.commission)
  experiment!: Experiment;

  @OneToMany(() => CommComment, (commComment) => commComment.commission)
  commComment!: CommComment;

  @ManyToOne(() => User, (user) => user.commission)
  @ManyToMany(() => User, (user) => user.commission) // comm_bookmark, comm_like
  user!: User;

  @ManyToMany(() => Category, (category) => category.commCategory) // comm_category
  commCategory!: Category;
}

export default Commission;
