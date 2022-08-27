import AppError from '@shared/errors/AppError';
import {
  FakeFindUserByIdRepository,
  FakeSaveUserRepository,
} from '../repositories/fakes';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { UpdateUserService } from './UpdateUserService';
import { IFindUserByIdRepository, ISaveUserRepository } from '../repositories';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUpdateUserDTO } from './dtos/UpdateUserDTO';

interface ISut {
  fakeFindUserByIdRepository: IFindUserByIdRepository;
  fakeHashProvider: IHashProvider;
  fakeSaveUserRepository: ISaveUserRepository;
  updateUserService: UpdateUserService;
}

const makeSut = (): ISut => {
  const fakeFindUserByIdRepository = new FakeFindUserByIdRepository();
  const fakeSaveUserRepository = new FakeSaveUserRepository();
  const fakeHashProvider = new FakeHashProvider();

  const updateUserService = new UpdateUserService(
    fakeFindUserByIdRepository,
    fakeHashProvider,
    fakeSaveUserRepository,
  );

  return {
    fakeHashProvider,
    fakeSaveUserRepository,
    fakeFindUserByIdRepository,
    updateUserService,
  };
};

const makeFakeRequestDTO = (): IUpdateUserDTO => ({
  userId: 'any_id',
  name: 'any_new_name',
  password: 'any_new_password',
  oldPassword: 'any_old_password',
});

describe('UpdateUserService', () => {
  it('Should call findUserById with corrects values', async () => {
    const { fakeFindUserByIdRepository, updateUserService } = makeSut();

    const spyFindUserById = jest.spyOn(fakeFindUserByIdRepository, 'find');

    await updateUserService.execute(makeFakeRequestDTO());

    expect(spyFindUserById).toHaveBeenCalledWith('any_id');
  });

  it('Should throw findUserById if throws', async () => {
    const { updateUserService, fakeFindUserByIdRepository } = makeSut();

    jest
      .spyOn(fakeFindUserByIdRepository, 'find')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = updateUserService.execute(makeFakeRequestDTO());

    await expect(promise).rejects.toThrow();
  });

  it('Should throw error if findUserById return undefined', async () => {
    const { fakeFindUserByIdRepository, updateUserService } = makeSut();

    jest
      .spyOn(fakeFindUserByIdRepository, 'find')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const promise = updateUserService.execute(makeFakeRequestDTO());

    await expect(promise).rejects.toEqual(
      new AppError('Usuário não encontrado no sistema', 404),
    );
  });

  it('Should call compareHash with corrects values', async () => {
    const { updateUserService, fakeHashProvider } = makeSut();

    const spyCompareHash = jest.spyOn(fakeHashProvider, 'compareHash');

    await updateUserService.execute(makeFakeRequestDTO());

    expect(spyCompareHash).toHaveBeenCalledWith(
      'any_old_password',
      'any_password',
    );
  });

  it('Should throw compareHash if throws', async () => {
    const { updateUserService, fakeHashProvider } = makeSut();

    jest.spyOn(fakeHashProvider, 'compareHash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = updateUserService.execute(makeFakeRequestDTO());

    await expect(promise).rejects.toThrow();
  });

  it('Should throw error if compareHash return false', async () => {
    const { fakeHashProvider, updateUserService } = makeSut();

    jest
      .spyOn(fakeHashProvider, 'compareHash')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)));

    const promise = updateUserService.execute(makeFakeRequestDTO());

    await expect(promise).rejects.toEqual(
      new AppError('Senha antiga errada.', 403),
    );
  });

  it('Should be able to update a user', async () => {
    const { updateUserService } = makeSut();

    const user = await updateUserService.execute(makeFakeRequestDTO());

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('any_new_name');
    expect(user.email).toBe('any@mail.com');
    expect(user.password).toBe('any_hash');
  });
});
