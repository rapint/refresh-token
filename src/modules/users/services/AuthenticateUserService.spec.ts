import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface ISut {
  fakeUsersRepository: IUsersRepository;
  fakeRefreshTokensRepository: IRefreshTokensRepository;
  fakeHashProvider: IHashProvider;
  authenticateUser: AuthenticateUserService;
}

const makeSut = (): ISut => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeHashProvider = new FakeHashProvider();
  const fakeRefreshTokensRepository = new FakeRefreshTokensRepository();

  const authenticateUser = new AuthenticateUserService(
    fakeUsersRepository,
    fakeHashProvider,
    fakeRefreshTokensRepository,
  );

  return {
    authenticateUser,
    fakeUsersRepository,
    fakeHashProvider,
    fakeRefreshTokensRepository,
  };
};

jest.mock('@config/auth', () => ({
  jwt: {
    secret: 'teste123',
    expiresIn: '1d',
  },
}));

describe('AuthenticateUser', () => {
  it('Should call findByEmail with corrects values', async () => {
    const { fakeUsersRepository, authenticateUser } = makeSut();

    const spyFindByEmail = jest.spyOn(fakeUsersRepository, 'findByEmail');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyFindByEmail).toHaveBeenCalledWith('any@mail.com');
  });

  it('Should throw error if findByEmail throws', async () => {
    const { fakeUsersRepository, authenticateUser } = makeSut();

    jest
      .spyOn(fakeUsersRepository, 'findByEmail')
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
    const { fakeUsersRepository, authenticateUser } = makeSut();

    jest
      .spyOn(fakeUsersRepository, 'findByEmail')
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
