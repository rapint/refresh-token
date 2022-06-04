import { IUserModel } from '@modules/users/models/IUserModel';
import { ISaveUserRepository } from '@modules/users/repositories';

export class FakeSaveUserRepository implements ISaveUserRepository {
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
}
