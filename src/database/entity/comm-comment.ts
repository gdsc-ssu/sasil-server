import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import User from './user';
import Commission from './commission';

@Entity()
class CommComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @Column('int', { nullable: true })
  parentId!: number;

  @ManyToOne(() => User, (user) => user.commComment)
  user!: User;

  @ManyToOne(() => Commission, (commission) => commission.commComment)
  commission!: Commission;
}

export default CommComment;
