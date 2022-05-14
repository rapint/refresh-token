import { IRefreshTokenModel } from '@modules/users/models/IRefreshTokenModel';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserOrm } from './UserOrm';

@Entity('refresh_tokens')
class RefreshToken implements IRefreshTokenModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrm, user => user.refreshTokens, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserOrm;

  @Column({ name: 'expiresIn' })
  expiresIn: number;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default RefreshToken;
