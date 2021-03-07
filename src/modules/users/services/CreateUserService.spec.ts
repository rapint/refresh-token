import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateSeries', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('José');
    expect(user.email).toBe('jose@email.com');
  });

  it('Should not be able to create a new user with email of another', async () => {
    await createUser.execute({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    await expect(
      createUser.execute({
        name: 'Almiran',
        email: 'jose@email.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
