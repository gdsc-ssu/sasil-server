/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

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

  @Column({ default: 'wait' })
  state!: 'wait' | 'connected';

  // Comm:User = N:1
  @ManyToOne(() => User, (user) => user.commissions)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // Comm:Exp = 1:N
  @OneToMany(() => Experiment, (experiment) => experiment.commission)
  experiments!: Experiment[];

  // Comm: ExpComment = 1:N
  @OneToMany(() => CommComment, (commComment) => commComment.commission)
  commComments!: CommComment[];

  // Comm:User = M:N -> comm_like
  @ManyToMany(() => User, (user) => user.likeComms)
  likes!: User[];

  // Comm:User = M:N -> comm_bookmark
  @ManyToMany(() => User, (user) => user.bookmarkComms)
  userBookmarks!: User[];

  // Comm:Category = M:N -> comm_category
  @ManyToMany(() => Category, (category) => category.commissions) // comm_category
  categories!: Category[];
}

export default Commission;
