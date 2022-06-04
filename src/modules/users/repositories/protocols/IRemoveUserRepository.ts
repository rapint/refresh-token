import { IUserModel } from '../../models/IUserModel';

export interface IRemoveUserRepository {
  remove(user: IUserModel): Promise<void>;
}
