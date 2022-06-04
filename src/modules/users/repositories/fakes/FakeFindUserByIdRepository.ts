import { IUserModel } from '@modules/users/models/IUserModel';
import { IFindUserByIdRepository } from '@modules/users/repositories';

export class FakeFindUserByIdRepository implements IFindUserByIdRepository {
  public async find(): Promise<IUserModel | undefined> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password',
      createdAt: new Date('2022-01-01T00:00:00'),
      updatedAt: new Date('2022-01-01T00:00:00'),
    };
  }
}
