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
import ReqComment from './req-comment';
import ReqLike from './req-like';
import Category from './category';

@Entity()
class Request extends BasicEntity {
  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 255, nullable: true })
  thumbnail!: string;

  @Column({ default: 'wait' })
  state!: 'wait' | 'connected';

  // Request:User = N:1
  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  // Request:Experiment = 1:N
  @OneToMany(() => Experiment, (experiment) => experiment.request)
  experiments!: Experiment[];

  // Request: ExpComment = 1:N
  @OneToMany(() => ReqComment, (reqComment) => reqComment.request)
  reqComments!: ReqComment[];

  // Request:ReqLike = 1:N
  @OneToMany(() => ReqLike, (reqLike) => reqLike.request)
  reqLikes!: ReqLike[];

  // Request:User = M:N -> req_bookmark
  @ManyToMany(() => User, (user) => user.bookmarkReqs)
  userBookmarks!: User[];

  // Request:Category = M:N -> req_category
  @ManyToMany(() => Category, (category) => category.requests) // req_category
  categories!: Category[];
}

export default Request;
