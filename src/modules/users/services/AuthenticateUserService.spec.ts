import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeRefreshTokensRepository: FakeRefreshTokensRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

jest.mock('@config/auth', () => ({
  jwt: {
    secret: 'teste123',
    expiresIn: '1d',
  },
}));

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeRefreshTokensRepository = new FakeRefreshTokensRepository();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeRefreshTokensRepository,
    );
  });

  it('Should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const response = await authenticateUser.execute({
      email: 'jose@email.com',
      password: '12345678',
    });

    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jose@email.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    await expect(
      authenticateUser.execute({
        email: 'jose@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
