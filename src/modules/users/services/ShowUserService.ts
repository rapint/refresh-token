import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: string): Promise<User | undefined> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não foi encontrado!', 404);
    }

    return user;
  }
}

export default ShowUserService;
