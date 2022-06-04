import { IUserModel } from '../../models/IUserModel';

export interface IFindUserByEmailRepository {
  find(email: string): Promise<IUserModel | undefined>;
}
