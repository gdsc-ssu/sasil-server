import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import User from './user';
import Experiment from './experiment';

@Entity()
class ExpComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @Column('int', { nullable: true })
  parentId!: number;

  @ManyToOne(() => User, (user) => user.expComment)
  user!: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.expComment)
  experiment!: Experiment;
}

export default ExpComment;
