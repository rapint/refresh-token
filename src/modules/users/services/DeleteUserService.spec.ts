import {
  IFindUserByIdRepository,
  IRemoveUserRepository,
} from '../repositories';
import {
  FakeFindUserByIdRepository,
  FakeRemoveUserRepository,
} from '../repositories/fakes';
import { DeleteUserService } from './DeleteUserService';

interface ISut {
  fakeFindUserByIdRepository: IFindUserByIdRepository;
  fakeRemoveUserRepository: IRemoveUserRepository;
  deleteUserService: DeleteUserService;
}

const makeSut = (): ISut => {
  const fakeFindUserByIdRepository = new FakeFindUserByIdRepository();
  const fakeRemoveUserRepository = new FakeRemoveUserRepository();

  const deleteUserService = new DeleteUserService(
    fakeFindUserByIdRepository,
    fakeRemoveUserRepository,
  );

  return {
    deleteUserService,
    fakeFindUserByIdRepository,
    fakeRemoveUserRepository,
  };
};

describe('DeleteUserService', () => {
  it('Should call FindUserByIdRepository with correct values', async () => {
    const { deleteUserService, fakeFindUserByIdRepository } = makeSut();

    const spyFindById = jest.spyOn(fakeFindUserByIdRepository, 'find');

    await deleteUserService.execute('user_id');

    expect(spyFindById).toHaveBeenCalledWith('user_id');
  });

  it('Should be able to delete a user', async () => {
    const { deleteUserService } = makeSut();

    const deletedUser = await deleteUserService.execute('user_id');

    expect(deletedUser).toBe(undefined);
  });
});
