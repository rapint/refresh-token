import AppError from '@shared/errors/AppError';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';
import FakeUsersRepository from '../repositories/fakes/FakeRemoveUserRepository';

import InvalidateRefreshTokenService from './InvalidateRefreshTokenService';
import AuthenticateUserService from './AuthenticateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;

let fakeRefreshTokensRepository: FakeRefreshTokensRepository;
let fakeUsersRepository: FakeUsersRepository;

let invalidateRefreshTokenService: InvalidateRefreshTokenService;
let authenticateUser: AuthenticateUserService;

describe('InvalidateRefreshTokenService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();

    fakeRefreshTokensRepository = new FakeRefreshTokensRepository();
    fakeUsersRepository = new FakeUsersRepository();

    invalidateRefreshTokenService = new InvalidateRefreshTokenService(
      fakeRefreshTokensRepository,
    );

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeRefreshTokensRepository,
    );
  });

  it('Should be able to invalidate update token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const {
      user: authenticatedUser,
      accessToken,
      refreshToken,
    } = await authenticateUser.execute({
      email: user.email,
      password: '12345678',
    });

    await invalidateRefreshTokenService.execute({
      userId: authenticatedUser.id,
      accessToken: `Bearer ${accessToken}`,
    });

    const checkRefreshTokenExists = await fakeRefreshTokensRepository.findByRefreshToken(
      refreshToken,
    );

    expect(checkRefreshTokenExists?.is_active).toEqual(false);
  });

  it('should not be able to invalidate other users tokens', async () => {
    expect(
      invalidateRefreshTokenService.execute({
        userId: 'non-existing-user',
        accessToken: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
