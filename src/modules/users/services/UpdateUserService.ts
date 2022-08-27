import AppError from '@shared/errors/AppError';

import { IFindUserByIdRepository, ISaveUserRepository } from '../repositories';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUserModel } from '../models/IUserModel';
import { IUpdateUserDTO } from './dtos/UpdateUserDTO';

export class UpdateUserService {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepository,
    private readonly hashProvider: IHashProvider,
    private readonly saveUserRepository: ISaveUserRepository,
  ) {}

  public async execute({
    password,
    name,
    oldPassword,
    userId,
  }: IUpdateUserDTO): Promise<IUserModel> {
    const user = await this.findUserByIdRepository.find(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado no sistema', 404);
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

    user.name = name;

    await this.saveUserRepository.save(user);

    return user;
  }
}
