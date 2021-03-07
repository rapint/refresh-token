import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserService from './ShowUserService';

let fakeUsersRepository: FakeUsersRepository;
let showUserService: ShowUserService;

describe('ShowUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserService = new ShowUserService(fakeUsersRepository);
  });

  it('Should be able to show a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const showUser = jest.spyOn(fakeUsersRepository, 'findById');

    await showUserService.execute(user.id);

    expect(showUser).toHaveBeenCalledWith(user.id);
  });

  it('Should not be able to show a non existing user', async () => {
    expect(showUserService.execute('non-existing-user')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
