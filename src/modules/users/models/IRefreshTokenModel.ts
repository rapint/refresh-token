import { IUserModel } from './IUserModel';

export interface IRefreshTokenModel {
  id: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  user?: IUserModel;
  expiresIn: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
