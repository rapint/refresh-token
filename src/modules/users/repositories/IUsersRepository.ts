import { IUserModel } from '../models/IUserModel';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<IUserModel | undefined>;
  findByEmail(email: string): Promise<IUserModel | undefined>;
  create(data: ICreateUserDTO): Promise<IUserModel>;
  save(user: IUserModel): Promise<IUserModel>;
  remove(user: IUserModel): Promise<void>;
}
