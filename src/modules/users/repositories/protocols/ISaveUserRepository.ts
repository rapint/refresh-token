import { IUserModel } from '../../models/IUserModel';

export interface ISaveUserRepository {
  save(user: IUserModel): Promise<IUserModel>;
}
