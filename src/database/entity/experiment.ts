/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Commission from './commission';
import ExpComment from './exp-comment';
import Category from './category';

@Entity()
class Experiment extends BasicEntity {
  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 255, nullable: true })
  thumbnail!: string;

  @OneToMany(() => ExpComment, (expComment) => expComment.experiment)
  expComment!: ExpComment;

  @ManyToOne(() => Commission, (commission) => commission.experiment)
  @JoinColumn({
    name: 'comm_id',
  })
  commission!: Commission;

  @ManyToOne(() => User, (user) => user.experiment)
  @ManyToMany(() => User, (user) => user.experiment) // exp_bookmark, exp_like
  user!: User;

  @ManyToMany(() => Category, (category) => category.expCategory) // exp_category
  expCategory!: Category;
}

export default Experiment;
