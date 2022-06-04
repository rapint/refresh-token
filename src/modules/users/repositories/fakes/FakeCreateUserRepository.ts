import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUserModel } from '@modules/users/models/IUserModel';
import { ICreateUserRepository } from '@modules/users/repositories';

export class FakeCreateUserRepository implements ICreateUserRepository {
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
}
