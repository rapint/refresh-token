import { v4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async index(): Promise<User[]> {
    return this.users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.email === email);

    return user;
  }

  public async create({
    email,
    password,
    name,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: v4(), email, password, name });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  public async remove(user: User): Promise<void> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users.splice(userIndex, 1);
  }
}

export default UsersRepository;
