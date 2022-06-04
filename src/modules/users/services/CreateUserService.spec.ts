import AppError from '@shared/errors/AppError';
import {
  FakeCreateUserRepository,
  FakeFindUserByEmailRepository,
} from '../repositories/fakes';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { CreateUserService } from './CreateUserService';
import {
  ICreateUserRepository,
  IFindUserByEmailRepository,
} from '../repositories';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface ISut {
  fakeFindUserByEmailRepository: IFindUserByEmailRepository;
  fakeCreateUserRepository: ICreateUserRepository;
  fakeHashProvider: IHashProvider;
  createUserService: CreateUserService;
}

jest.mock('../repositories/fakes/FakeFindUserByEmailRepository');

const makeSut = (): ISut => {
  const fakeFindUserByEmailRepository = new FakeFindUserByEmailRepository();
  const fakeCreateUserRepository = new FakeCreateUserRepository();
  const fakeHashProvider = new FakeHashProvider();

  const createUserService = new CreateUserService(
    fakeFindUserByEmailRepository,
    fakeCreateUserRepository,
    fakeHashProvider,
  );

  return {
    createUserService,
    fakeHashProvider,
    fakeCreateUserRepository,
    fakeFindUserByEmailRepository,
  };
};

describe('CreateUser', () => {
  it('Should call findByEmail with corrects values', async () => {
    const { createUserService, fakeFindUserByEmailRepository } = makeSut();

    const spyFindByEmail = jest.spyOn(fakeFindUserByEmailRepository, 'find');

    await createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    expect(spyFindByEmail).toHaveBeenCalledWith('any@email.com');
  });

  it('Should throw findByEmail if throws', async () => {
    const { createUserService, fakeFindUserByEmailRepository } = makeSut();

    jest
      .spyOn(fakeFindUserByEmailRepository, 'find')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    await expect(promise).rejects.toThrow();
  });

  it('Should throw error if findByEmail return user', async () => {
    const { fakeFindUserByEmailRepository, createUserService } = makeSut();

    jest.spyOn(fakeFindUserByEmailRepository, 'find').mockReturnValueOnce(
      new Promise(resolve =>
        resolve({
          id: 'any_id',
          name: 'any_name',
          email: 'any@mail.com',
          password: 'hashed_password',
          createdAt: new Date('2022-01-01T00:00:00'),
          updatedAt: new Date('2022-01-01T00:00:00'),
        }),
      ),
    );

    const promise = createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    await expect(promise).rejects.toEqual(
      new AppError('Email já cadastrado no sistema.', 409),
    );
  });

  it('Should call generateHash with corrects values', async () => {
    const { createUserService, fakeHashProvider } = makeSut();

    const spyGenerateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    expect(spyGenerateHash).toHaveBeenCalledWith('12345678');
  });

  it('Should throw generateHash if throws', async () => {
    const { createUserService, fakeHashProvider } = makeSut();

    jest.spyOn(fakeHashProvider, 'generateHash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    await expect(promise).rejects.toThrow();
  });

  it('Should call create with corrects values', async () => {
    const { createUserService, fakeCreateUserRepository } = makeSut();

    const spyCreate = jest.spyOn(fakeCreateUserRepository, 'create');

    await createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    expect(spyCreate).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_hash',
    });
  });

  it('Should be able to create a new user', async () => {
    const { createUserService } = makeSut();

    const user = await createUserService.execute({
      name: 'any_name',
      email: 'any@email.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any@email.com');
  });
});
