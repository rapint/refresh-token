import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface ISut {
  fakeUsersRepository: IUsersRepository;
  fakeHashProvider: IHashProvider;
  createUserService: CreateUserService;
}

const makeSut = (): ISut => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeHashProvider = new FakeHashProvider();

  const createUserService = new CreateUserService(
    fakeUsersRepository,
    fakeHashProvider,
  );

  return {
    createUserService,
    fakeHashProvider,
    fakeUsersRepository,
  };
};

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const { createUserService, fakeUsersRepository } = makeSut();

    jest
      .spyOn(fakeUsersRepository, 'findByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const user = await createUserService.execute({
      name: 'any_name',
      email: 'any_email@email.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any_email@email.com');
  });
});
