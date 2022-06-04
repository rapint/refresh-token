import AppError from '@shared/errors/AppError';
import { FakeEncrypterProvider } from '@shared/container/encrypterProvider/fakes/FakeEncrypterProvider';
import { IEncrypter } from '@shared/container/encrypterProvider/protocols/IEncrypt';
import { FakeGenerateHashProvider } from '@shared/container/generateHashProvider/fakes/FakeGenerateHashProvider';
import { IGenerateHashProvider } from '@shared/container/generateHashProvider/protocols/IGenerateHashProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { IFindUserByEmailRepository } from '../repositories';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';
import { FakeFindUserByEmailRepository } from '../repositories/fakes';
import AuthenticateUserService from './AuthenticateUserService';

interface ISut {
  fakeFindUserByEmailRepository: IFindUserByEmailRepository;
  fakeHashProvider: IHashProvider;
  fakeEncrypterProvider: IEncrypter;
  fakeGenerateHashProvider: IGenerateHashProvider;
  fakeRefreshTokensRepository: IRefreshTokensRepository;
  authenticateUser: AuthenticateUserService;
}

const makeSut = (): ISut => {
  const fakeFindUserByEmailRepository = new FakeFindUserByEmailRepository();
  const fakeHashProvider = new FakeHashProvider();
  const fakeEncrypterProvider = new FakeEncrypterProvider();
  const fakeGenerateHashProvider = new FakeGenerateHashProvider();
  const fakeRefreshTokensRepository = new FakeRefreshTokensRepository();

  const authenticateUser = new AuthenticateUserService(
    fakeFindUserByEmailRepository,
    fakeHashProvider,
    fakeEncrypterProvider,
    fakeGenerateHashProvider,
    fakeRefreshTokensRepository,
  );

  return {
    authenticateUser,
    fakeFindUserByEmailRepository,
    fakeHashProvider,
    fakeEncrypterProvider,
    fakeGenerateHashProvider,
    fakeRefreshTokensRepository,
  };
};

jest.mock('@config/refreshToken', () => {
  return { refreshToken: { expiresIn: 100 } };
});

describe('AuthenticateUser', () => {
  it('Should call findByEmail with corrects values', async () => {
    const { fakeFindUserByEmailRepository, authenticateUser } = makeSut();

    const spyFindByEmail = jest.spyOn(fakeFindUserByEmailRepository, 'find');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyFindByEmail).toHaveBeenCalledWith('any@mail.com');
  });

  it('Should throw error if findByEmail throws', async () => {
    const { fakeFindUserByEmailRepository, authenticateUser } = makeSut();

    jest
      .spyOn(fakeFindUserByEmailRepository, 'find')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow();
  });

  it('Should throw error if findByEmail return undefined', async () => {
    const { fakeFindUserByEmailRepository, authenticateUser } = makeSut();

    jest
      .spyOn(fakeFindUserByEmailRepository, 'find')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const promise = authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    await expect(promise).rejects.toEqual(
      new AppError('Combinação de email/senha incorreta.', 401),
    );
  });

  it('Should call compareHash with values corrects', async () => {
    const { fakeHashProvider, authenticateUser } = makeSut();

    const spyCompareHash = jest.spyOn(fakeHashProvider, 'compareHash');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyCompareHash).toHaveBeenCalledWith(
      'any_password',
      'hashed_password',
    );
  });

  it('Should throw error if compareHash throws', async () => {
    const { fakeHashProvider, authenticateUser } = makeSut();

    jest.spyOn(fakeHashProvider, 'compareHash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow();
  });

  it('Should throw error if compareHash return false', async () => {
    const { fakeHashProvider, authenticateUser } = makeSut();

    jest
      .spyOn(fakeHashProvider, 'compareHash')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)));

    const promise = authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    await expect(promise).rejects.toEqual(
      new AppError('Combinação de email/senha incorreta.', 401),
    );
  });

  it('Should call encrypt with values corrects', async () => {
    const { fakeEncrypterProvider, authenticateUser } = makeSut();

    const spyEncrypt = jest.spyOn(fakeEncrypterProvider, 'encrypt');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyEncrypt).toHaveBeenCalledWith('any_id');
  });

  it('Should throw error if encrypt throws', async () => {
    const { fakeEncrypterProvider, authenticateUser } = makeSut();

    jest.spyOn(fakeEncrypterProvider, 'encrypt').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow();
  });

  it('Should call generateHash with values corrects', async () => {
    const { fakeGenerateHashProvider, authenticateUser } = makeSut();

    const spyGenerate = jest.spyOn(fakeGenerateHashProvider, 'generate');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyGenerate).toHaveBeenCalledWith(12);
  });

  it('Should throw error if generateHash throws', async () => {
    const { fakeGenerateHashProvider, authenticateUser } = makeSut();

    jest
      .spyOn(fakeGenerateHashProvider, 'generate')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow();
  });

  it('Should call create of RefreshTokenRepository with values corrects', async () => {
    const { fakeRefreshTokensRepository, authenticateUser } = makeSut();

    const spyCreate = jest.spyOn(fakeRefreshTokensRepository, 'create');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyCreate).toHaveBeenCalledWith({
      accessToken: 'any_token',
      expiresIn: 100,
      isActive: true,
      refreshToken: 'any_hash',
      userId: 'any_id',
    });
  });

  it('Should be able to authenticate', async () => {
    const { authenticateUser } = makeSut();

    const response = await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user.id).toBe('any_id');
  });
});
