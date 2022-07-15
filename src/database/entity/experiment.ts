/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import BasicEntity from './basic-entity';
import User from './user';
import Request from './request';
import ExpComment from './exp-comment';
import ExpLike from './exp-like';
import ExpBookmark from './exp-bookmark';
import ExpCategory from './exp-category';

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

  // Experiment:Request = N:1
  @ManyToOne(() => Request, (request) => request.experiments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'req_id',
  })
  request!: Request;

  // Exp:ExpComment = 1:N
  @OneToMany(() => ExpComment, (expComment) => expComment.experiment)
  expComments!: ExpComment[];

  // Exp:ExpLike = 1:N
  @OneToMany(() => ExpLike, (expLike) => expLike.experiment)
  expLikes!: ExpLike[];

  // Exp:ExpBookmark = 1:N
  @OneToMany(() => ExpBookmark, (expBookmark) => expBookmark.experiment)
  expBookmarks!: ExpBookmark[];

  // Exp:ExpCategory = 1:N
  @OneToMany(() => ExpCategory, (expCategory) => expCategory.experiment)
  expCategories!: ExpCategory[];
}

export default Experiment;
