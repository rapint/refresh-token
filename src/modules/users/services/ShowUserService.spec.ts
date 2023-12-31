import AppError from '@shared/errors/AppError';
import { IFindUserByIdRepository } from '../repositories';
import { FakeFindUserByIdRepository } from '../repositories/fakes';
import { ShowUserService } from './ShowUserService';

interface ISut {
  fakeFindUserByIdRepository: IFindUserByIdRepository;
  showUserService: ShowUserService;
}

const makeSut = (): ISut => {
  const fakeFindUserByIdRepository = new FakeFindUserByIdRepository();

  const showUserService = new ShowUserService(fakeFindUserByIdRepository);

  return {
    showUserService,
    fakeFindUserByIdRepository,
  };
};

const userId = 'any_id';

describe('ShowUserService', () => {
  it('Should call FindUserByIdRepository with corrects values', async () => {
    const { showUserService, fakeFindUserByIdRepository } = makeSut();

    const spyFind = jest.spyOn(fakeFindUserByIdRepository, 'find');

    await showUserService.execute(userId);

    expect(spyFind).toHaveBeenCalledWith(userId);
  });

  it('Should throw if FindUserByIdRepository throws', async () => {
    const { showUserService, fakeFindUserByIdRepository } = makeSut();

    jest
      .spyOn(fakeFindUserByIdRepository, 'find')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = showUserService.execute(userId);

    await expect(promise).rejects.toThrow();
  });

  it('Should throw if FindUserByIdRepository return undefined', async () => {
    const { showUserService, fakeFindUserByIdRepository } = makeSut();

    jest
      .spyOn(fakeFindUserByIdRepository, 'find')
      .mockImplementationOnce(() => new Promise(resolve => resolve(undefined)));

    const promise = showUserService.execute(userId);

    await expect(promise).rejects.toEqual(
      new AppError('Usuário não foi encontrado.', 404),
    );
  });

  it('Should be able to show a user', async () => {
    const { showUserService } = makeSut();

    const user = await showUserService.execute(userId);

    expect(user).toHaveProperty('id');
    expect(user.id).toBe('any_id');
  });
});
