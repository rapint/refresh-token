export interface IUserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens?: any[];
}
