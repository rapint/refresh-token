import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeRemoveUserRepository';
import DeleteUserService from './DeleteUserService';

let fakeUsersRepository: FakeUsersRepository;
let deleteUserService: DeleteUserService;

describe('DeleteUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    deleteUserService = new DeleteUserService(fakeUsersRepository);
  });

  it('Should be able to delete a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José',
      email: 'jose@email.com',
      password: '12345678',
    });

    const deleteUser = jest.spyOn(fakeUsersRepository, 'remove');

    await deleteUserService.execute(user.id);

    expect(deleteUser).toHaveBeenCalledWith(user);
  });

  it('Should not be able to delete a non existing user', async () => {
    expect(
      deleteUserService.execute('non-existing-user'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
