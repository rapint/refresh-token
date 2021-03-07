import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from './User';

@Entity('Refresh_tokens')
class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, user => user.refresh_tokens, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  expires_in: number;

  @Column({ default: false })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RefreshToken;
