import AppError from '@shared/errors/AppError';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';
import FakeUsersRepository from '../repositories/fakes/FakeRemoveUserRepository';

import UpdateRefreshTokenService from './UpdateRefreshTokenService';
import AuthenticateUserService from './AuthenticateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;

let fakeRefreshTokensRepository: FakeRefreshTokensRepository;
let fakeUsersRepository: FakeUsersRepository;

let updateRefreshTokenService: UpdateRefreshTokenService;
let authenticateUser: AuthenticateUserService;

describe('UpdateRefreshTokenService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();

    fakeRefreshTokensRepository = new FakeRefreshTokensRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateRefreshTokenService = new UpdateRefreshTokenService(
      fakeRefreshTokensRepository,
      fakeUsersRepository,
    );

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeRefreshTokensRepository,
    );
  });

  it('Should be able to update the access token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const {
      user: authenticatedUser,
      refreshToken,
    } = await authenticateUser.execute({
      email: user.email,
      password: '12345678',
    });

    const response = await updateRefreshTokenService.execute(refreshToken);

    expect(authenticatedUser).toEqual(response.user);
    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('refreshToken');
  });

  it('should not be able to update the access token when it does not exist', async () => {
    const response = updateRefreshTokenService.execute(
      'no-refresh-token-exists',
    );

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the access token if the update token is invalid', async () => {
    fakeRefreshTokensRepository.create({
      access_token: 'access-token',
      expires_in: 60,
      is_active: false,
      refresh_token: 'refresh-token',
      user_id: 'no-user-exist',
    });

    const response = updateRefreshTokenService.execute('refresh-token');

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the access token if the update token is expired', async () => {
    fakeRefreshTokensRepository.create({
      access_token: 'access-token',
      expires_in: 60,
      is_active: true,
      refresh_token: 'refresh-token',
      user_id: 'no-user-exist',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const response = updateRefreshTokenService.execute('refresh-token');

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the access token if the user does not exist', async () => {
    fakeRefreshTokensRepository.create({
      access_token: 'access-token',
      expires_in: 60,
      is_active: true,
      refresh_token: 'refresh-token',
      user_id: 'no-user-exist',
    });

    const response = updateRefreshTokenService.execute('refresh-token');

    await expect(response).rejects.toBeInstanceOf(AppError);
  });
});
