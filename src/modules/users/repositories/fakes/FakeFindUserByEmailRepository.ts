import { IUserModel } from '@modules/users/models/IUserModel';
import { IFindUserByEmailRepository } from '@modules/users/repositories';

export class FakeFindUserByEmailRepository
  implements IFindUserByEmailRepository {
  public async find(): Promise<IUserModel | undefined> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any@mail.com',
      password: 'hashed_password',
      createdAt: new Date('2022-01-01T00:00:00'),
      updatedAt: new Date('2022-01-01T00:00:00'),
    };
  }
}
