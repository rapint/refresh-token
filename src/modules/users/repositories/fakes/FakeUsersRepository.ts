import { v4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { IUserModel } from '@modules/users/models/IUserModel';
import { UserOrm } from '@modules/users/infra/typeorm/entities/UserOrm';

class UsersRepository implements IUsersRepository {
  private users: IUserModel[] = [];

  public async index(): Promise<IUserModel[]> {
    return this.users;
  }

  public async findById(id: string): Promise<IUserModel | undefined> {
    const user = this.users.find(findUser => findUser.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<IUserModel | undefined> {
    const user = this.users.find(findUser => findUser.email === email);

    return user;
  }

  public async create({
    email,
    password,
    name,
  }: ICreateUserDTO): Promise<IUserModel> {
    const user = new UserOrm();

    Object.assign(user, { id: v4(), email, password, name });

    this.users.push(user);

    return user;
  }

  public async save(user: IUserModel): Promise<IUserModel> {
    this.users.push(user);
    return user;
  }

  public async remove(user: IUserModel): Promise<void> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users.splice(userIndex, 1);
  }
}

export default UsersRepository;
