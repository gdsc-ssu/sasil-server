import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import User from './user';
import Commission from './commission';
import ExpComment from './exp-comment';
import Category from './category';

@Entity()
class Experiment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 255, nullable: true })
  thumbnail!: string;

  @ManyToOne(() => User, (user) => user.experiment)
  @ManyToMany(() => User, (user) => user.experiment)
  user!: User;

  @ManyToMany(() => Category, (category) => category.expCategory)
  expCategory!: Category;

  @ManyToOne(() => Commission, (commission) => commission.experiment)
  commission!: Commission;

  @OneToMany(() => ExpComment, (expComment) => expComment.experiment)
  expComment!: ExpComment;
}

export default Experiment;
