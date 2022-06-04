import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserService from './UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserService: UpdateUserService;

describe('UpdateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserService = new UpdateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to update a user and password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const updateUser = jest.spyOn(fakeUsersRepository, 'save');

    await updateUserService.execute({
      userId: user.id,
      email: 'email@email.com',
      name: 'José atualizado',
      password: '123456',
      oldPassword: '12345678',
    });

    expect(updateUser).toHaveBeenCalledWith(user);
  });

  it('Should be able to update a user without updating password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const updateUser = jest.spyOn(fakeUsersRepository, 'save');

    await updateUserService.execute({
      userId: user.id,
      email: 'email@email.com',
      name: 'José atualizado',
    });

    expect(updateUser).toHaveBeenCalledWith(user);
  });

  it('Should not be able to update a user with a non existing user', async () => {
    expect(
      updateUserService.execute({
        userId: 'non-existing-user',
        email: 'email@email.com',
        name: 'José atualizado',
        password: '123456',
        oldPassword: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update a user with existing email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    await fakeUsersRepository.create({
      name: 'José',
      email: 'teste@email.com',
      password: '12345678',
    });

    expect(
      updateUserService.execute({
        userId: user.id,
        email: 'teste@email.com',
        name: 'José atualizado',
        password: '123456',
        oldPassword: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update a user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    expect(
      updateUserService.execute({
        userId: user.id,
        email: 'teste@email.com',
        name: 'José atualizado',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update a user password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    expect(
      updateUserService.execute({
        userId: user.id,
        email: 'teste@email.com',
        name: 'José atualizado',
        password: '123456',
        oldPassword: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
