import { IUserModel } from '../../models/IUserModel';

export interface IFindUserByIdRepository {
  find(id: string): Promise<IUserModel | undefined>;
}
