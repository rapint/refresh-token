import AppError from '@shared/errors/AppError';
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

const userId = 'any_id';

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

    await deleteUserService.execute(userId);

    expect(spyFindById).toHaveBeenCalledWith(userId);
  });

  it('Should throw if FindUserByIdRepository throws', async () => {
    const { deleteUserService, fakeFindUserByIdRepository } = makeSut();

    jest
      .spyOn(fakeFindUserByIdRepository, 'find')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = deleteUserService.execute(userId);

    await expect(promise).rejects.toThrow();
  });

  it('Should throw if FindUserByIdRepository return undefined', async () => {
    const { deleteUserService, fakeFindUserByIdRepository } = makeSut();

    jest
      .spyOn(fakeFindUserByIdRepository, 'find')
      .mockImplementationOnce(() => new Promise(resolve => resolve(undefined)));

    const promise = deleteUserService.execute(userId);

    await expect(promise).rejects.toEqual(
      new AppError('Usuário não encontrado.', 404),
    );
  });

  it('Should call RemoveUserRepository with correct values', async () => {
    const { deleteUserService, fakeRemoveUserRepository } = makeSut();

    const spyRemove = jest.spyOn(fakeRemoveUserRepository, 'remove');

    await deleteUserService.execute(userId);

    expect(spyRemove).toHaveBeenCalledWith(userId);
  });

  it('Should be able to delete a user', async () => {
    const { deleteUserService } = makeSut();

    const deletedUser = await deleteUserService.execute(userId);

    expect(deletedUser).toBe(undefined);
  });
});
