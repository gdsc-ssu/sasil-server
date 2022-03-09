import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import User from './user';
import Experiment from './experiment';
import CommComment from './comm-comment';
import Category from './category';

@Entity()
class Commission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 255, nullable: true })
  thumbnail!: string;

  @OneToMany(() => Experiment, (experiment) => experiment.commission)
  experiment!: Experiment;

  @ManyToOne(() => User, (user) => user.commission)
  @ManyToMany(() => User, (user) => user.commission)
  user!: User;

  @ManyToMany(() => Category, (category) => category.commCategory)
  commCategory!: Category;

  @OneToMany(() => CommComment, (commComment) => commComment.commission)
  commComment!: CommComment;
}

export default Commission;
