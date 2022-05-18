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

  // Exp:User = N:1
  @ManyToOne(() => User, (user) => user.experiments)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // Exp:Comm = N:1
  @ManyToOne(() => Commission, (commission) => commission.experiments)
  @JoinColumn({
    name: 'comm_id',
  })
  commission!: Commission;

  // Exp:ExpComment = 1:N
  @OneToMany(() => ExpComment, (expComment) => expComment.experiment)
  expComments!: ExpComment[];

  // Exp:User = M:N -> exp_like
  @ManyToMany(() => User, (user) => user.likeExps)
  likes!: User[];

  // Exp:User = M:N -> exp_bookmark
  @ManyToMany(() => User, (user) => user.bookmarkExps)
  userBookmarks!: User[];

  // Exp:Category = M:N -> exp_category
  @ManyToMany(() => Category, (category) => category.experiments)
  categories!: Category[];
}

export default Experiment;
