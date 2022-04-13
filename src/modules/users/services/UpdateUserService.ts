import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUserModel } from '../models/IUserModel';

interface IRequest {
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
  userId: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
    name,
    oldPassword,
    userId,
  }: IRequest): Promise<IUserModel> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado no sistema', 404);
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== userId) {
      throw new AppError('E-mail já está em uso.', 409);
    }

    if (password && !oldPassword) {
      throw new AppError('Precisa informar a senha antiga.', 409);
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Senha antiga errada.', 403);
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.email = email;
    user.name = name;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
