import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { IUserModel } from '@modules/users/models/IUserModel';

class UsersRepository implements IUsersRepository {
  public async index(): Promise<IUserModel[]> {
    return [
      {
        id: 'any_id',
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        createdAt: new Date('2022-01-01T00:00:00'),
        updatedAt: new Date('2022-01-01T00:00:00'),
      },
    ];
  }

  public async findById(): Promise<IUserModel | undefined> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
      createdAt: new Date('2022-01-01T00:00:00'),
      updatedAt: new Date('2022-01-01T00:00:00'),
    };
  }

  public async findByEmail(): Promise<IUserModel | undefined> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
      createdAt: new Date('2022-01-01T00:00:00'),
      updatedAt: new Date('2022-01-01T00:00:00'),
    };
  }

  public async create({
    email,
    password,
    name,
  }: ICreateUserDTO): Promise<IUserModel> {
    return {
      id: 'any_id',
      name,
      email,
      password,
      createdAt: new Date('2022-01-01T00:00:00'),
      updatedAt: new Date('2022-01-01T00:00:00'),
    };
  }

  public async save(): Promise<IUserModel> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
      createdAt: new Date('2022-01-01T00:00:00'),
      updatedAt: new Date('2022-01-01T00:00:00'),
    };
  }

  public async remove(): Promise<void> {
    await new Promise(resolve => {
      resolve(null);
    });
  }
}

export default UsersRepository;
