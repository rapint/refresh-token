import { IRemoveUserRepository } from '@modules/users/repositories';

export class FakeRemoveUserRepository implements IRemoveUserRepository {
  public async remove(): Promise<void> {
    await new Promise(resolve => {
      resolve(null);
    });
  }
}
