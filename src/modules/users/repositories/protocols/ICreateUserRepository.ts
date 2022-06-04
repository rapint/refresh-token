import { IUserModel } from '../../models/IUserModel';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';

export interface ICreateUserRepository {
  create(data: ICreateUserDTO): Promise<IUserModel>;
}
