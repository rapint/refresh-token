import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeRefreshTokensRepository: FakeRefreshTokensRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

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

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeRefreshTokensRepository,
    );
  });

  it('Should call findByEmail with corrects values', async () => {
    const spyFindByEmail = jest.spyOn(fakeUsersRepository, 'findByEmail');

    await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(spyFindByEmail).toHaveBeenCalledWith('any@mail.com');
  });

  it('Should throw error if findByEmail throws', async () => {
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

  it('Should be able to authenticate', async () => {
    const response = await authenticateUser.execute({
      email: 'any@mail.com',
      password: 'any_password',
    });

    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user.id).toBe('any_id');
  });
});
